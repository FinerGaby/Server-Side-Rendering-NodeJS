const express = require("express");
const app = express();
const expressSession = require('express-session');
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
const port = 3000;
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
// Configuramos la url dónde está corriendo MongoDB, base de datos y nombre de la colección
const url = "mongodb://localhost:27017";
// const dbName = 'users';
// const collectionName = 'users';

// Creamos una nueva instancia de MongoClient
const client = new MongoClient(url);

// Utilizamos el método connect para conectarnos a MongoDB
client.connect(function(err, client) {
  // Acá va todo el código para interactuar con MongoDB
  console.log("Conectados a MongoDB");

  // Luego de usar la conexión podemos cerrarla
  client.close();
});

// Settings
app.set("port", process.env.PORT || 3000);

// Middlawares
app.use(morgan("dev"));


// Manejo de sesión en Express con opciones basatante default, que no interesa
// ahora profundizar, que definen el comportamiento ante ciertas ocasiones, más
// bien orientadas a cuestiones de seguridad.
app.use(expressSession({
  secret: 'esta propiedad puede tener LITERALMENTE CUALQUIER COSA',
  resave: false,
  saveUninitialized: false
}))


//te transforma todo en json body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static File
app.use(express.static(path.join(__dirname, "/public")));

//handlebars base
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main-layout",
    layoutsDir: path.join(__dirname, "views/layouts")
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//RUTA HOME
app.get("/", function(req, res) {
  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    let coleccion = db.collection("posts");
    let coleccion2 = db.collection("comentarios");
    coleccion2.find().toArray(function(err, comment) {
      coleccion.find().toArray(function(err, users) {
        const numbercomment = comment.length;
        const numberpost = users.length;
        const usersreverse = users.reverse();
        console.log(numbercomment);
        console.log(numberpost);
        let userInfo;
        if (req.session.userId !== undefined) {
          userInfo = {
            userId: req.session.userId,
            userUsuario: req.session.userUsuario,
            userAvatar: req.session.userAvatar
          }
        res.render("home", {
          userInfo: userInfo,
          numbercomment: numbercomment,
          numberpost: numberpost,
          usersreverse: usersreverse
        });
      } else {
    
        // Si mi usuarix tipeó "localhost:3000/home" en la barra de direcciones del navegador y
        // no tenía una sesión activa, lo redirijo a la página que tiene el login.
        res.render("home", {
          userInfo: userInfo,
          numbercomment: numbercomment,
          numberpost: numberpost,
          usersreverse: usersreverse
        });
    
      }
      });
    });
  });
});

// // RUTA DE LOS POSTEO FILTRADO POR ID
// app.get('/posts/:id', function (req, res) {

//   const id = req.params.id;

//   client.connect(function(error, client) {
//     const db = client.db("dbPrincipal");
//     const coleccion = db.collection('posts');
//       //coleccion.findOne({ }, (err, users) => {
//       coleccion.findOne({ _id: new mongodb.ObjectID(req.params.id) }, (err, posts) => {
//       console.log(id)
//       console.log(posts);
//       console.log(err)
//       res.render('posts', {
//         id: id,
//         posts: posts
//       });
//     });
//   })
// })

// RUTA DE LOS POSTEO FILTRADO POR TITULO
app.get("/posts/:id", function(req, res) {
  const id = req.params.id;

  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    let coleccion = db.collection("posts");
    //coleccion.findOne({ }, (err, users) => {
    coleccion.findOne(
      { _id: new mongodb.ObjectID(req.params.id) },
      (err, post) => {
        // console.log(titulo)
        //console.log(posts);
        // console.log(err)
 
        let coleccion = db.collection("comentarios");
        //coleccion.findOne({ }, (err, users) => {
        coleccion
          .find({ _idpost: post._id.toString() })
          .toArray((err, commentList) => {
        console.log(post.id);
            console.log(post._id);
            console.log(commentList);
            let userInfo;
            if (req.session.userId !== undefined) {
              userInfo = {
                userId: req.session.userId,
                userUsuario: req.session.userUsuario,
                userAvatar: req.session.userAvatar
              }
            res.render("posts", {
              userInfo: userInfo,
              id: id,
              post: post,
              commentList: commentList
            });
          } else {
    
            // Si mi usuarix tipeó "localhost:3000/home" en la barra de direcciones del navegador y
            // no tenía una sesión activa, lo redirijo a la página que tiene el login.
            res.redirect("/login");
        
          }
          });
      }
    );
  });
});

// COMENTARIOS
app.post("/crearnuevo/comentario", function(req, res) {
  const reqBodys = {
    _idpost: req.body.postsid,
    userid: req.body.userid,
    comentario: req.body.comentario,
    avatarcooment: req.body.avatarcooment
  };

  console.log(reqBodys);

  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    const coleccion = db.collection("comentarios");

    coleccion.insertOne(reqBodys, (err, result) => {
      res.redirect("/");
    });
  });
});

// // RUTA DE LOS POSTEO FILTRADO POR TITULO
// app.get('/posts/:titulo', function (req, res) {

//   const titulo = req.params.titulo;

//   client.connect(function(error, client) {
//     const db = client.db("dbPrincipal");
//     const coleccion = db.collection('posts');
//       //coleccion.findOne({ }, (err, users) => {
//       coleccion.findOne({ titulo: titulo }, (err, posts) => {
//       console.log(titulo)
//       console.log(posts);
//       console.log(err)
//       res.render('posts', {
//         posts: posts
//       });
//     });
//   })
// })

// RUTA NUEVO POST - ESTAN LOS FORM
app.get("/nuevo", function(req, res) {
  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    const coleccion = db.collection("usuarios");

    coleccion.findOne(function(err, users) {
      console.log(users);
      let userInfo;
      if (req.session.userId !== undefined) {
        userInfo = {
          userId: req.session.userId,
          userUsuario: req.session.userUsuario,
          userAvatar: req.session.userAvatar
        }
      res.render("newposts", { 
        userInfo: userInfo,
        users: users 
      });
    } else {
    
      // Si mi usuarix tipeó "localhost:3000/home" en la barra de direcciones del navegador y
      // no tenía una sesión activa, lo redirijo a la página que tiene el login.
      res.redirect("/login");
  
    }
    });
  });
});

//RUTA CUANDO SE CREA EL POST
app.post("/crearnuevo/post", function(req, res) {
  console.log(req.body);

  const reqBodys = {
    idtest: req.body.idtest,
    avatar: req.body.avatar,
    userid: req.body.userid,
    titulo: req.body.titulo,
    texto: req.body.texto,
    fecha: req.body.fecha,
    categoria: req.body.categoria
  };

  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    const coleccion = db.collection("posts");

    coleccion.insertOne(reqBodys, (err, result) => {
      res.redirect("/");
    });
  });
});

// RUTA DE EDITAR EL POST FILTRADO POR ID
app.get("/editar/:id", function(req, res) {
  const id = req.params.id;

  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    const coleccion = db.collection("posts");
    //coleccion.findOne({ }, (err, users) => {
    coleccion.findOne(
      { _id: new mongodb.ObjectID(req.params.id) },
      (err, posts) => {
        // console.log(id)
        // console.log(posts);
        // console.log(err)
        res.render("editar", {
          id: id,
          posts: posts
        });
      }
    );
  });
});

//RUTA SE EDITA EL POST AL APRETAR EL BOTON SUBMIT DEL FORM
app.post("/editar/post", function(req, res) {
  const reqBodys = {
    titulo: req.body.titulo,
    texto: req.body.texto,
    id: req.body.idtest,
    categoria: req.body.categoria
  };

  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    const coleccion = db.collection("posts");

    coleccion.updateOne(
      { _id: new mongodb.ObjectId(reqBodys.id) },
      {
        $set: {
          titulo: reqBodys.titulo,
          texto: reqBodys.texto,
          categoria: reqBodys.categoria
        }
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      }
    );
  });
});





// RUTA REGISTRAR HANDLEBARS
app.get("/registrarse", function(req, res) {

    res.render("registrar");

});



//RUTA CUANDO SE CREA EL POST
app.post("/registrarusuario", function(req, res) {
  console.log(req.body);

  const reqBodys = {
    usuario: req.body.usuario.toUpperCase(),
    email: req.body.email.toUpperCase(),
    password: req.body.password,
    avatar: req.body.avatar
  };

  client.connect(function(error, client) {
    const db = client.db("dbPrincipal");
    const coleccion = db.collection("usuarios");

    coleccion.insertOne(reqBodys, (err, result) => {
      res.redirect("/");
    });
  });
});




//RUTA LOGIN 
app.get('/login', function (req, res) {

    res.render('login');

});



//RUTA LOGIN FORM
app.post('/login/form', function (req, res) {

  const usuario = req.body.usuario.toUpperCase();
  const password = req.body.password.toUpperCase();

  //conectar cliente
  client.connect(function(error, client) {
    //busco la database principal
    const db = client.db("dbPrincipal");
    //especifico la coleccion que usare
    const coleccion = db.collection('usuarios');
    //filtro coleccion segun el nombre de usuario y password
    coleccion.find( { usuario: usuario, password: password }).toArray(function(err, data) {
      if (data.length == 1) {
        console.log(data);
        // Si encontró un solo registro con ese usuario y clave
        // Callback para invocar si validó bien. Guarda la sesión e indica navegar al home.
        req.session.userId = data[0]._id;
        req.session.userUsuario = data[0].usuario;
        req.session.userAvatar = data[0].avatar;
        res.redirect('/');
        } else {
        // Si lo que ingresaste es incorrecto
        // Si validó mal, se destruye la sesión (por si la hubiera) y redirige a página inicial
        req.session.destroy();
        res.redirect('/login');
        }
    });
  });
});


// GET logout
app.get('/logout', (req, res) => {

  // Destruyo sesión y redirijo al login.
  req.session.destroy();
  res.redirect("/");

});



// Starting The Server
app.listen(port, function() {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
