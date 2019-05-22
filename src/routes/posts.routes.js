const express = require('express');

const { client, mongodb }  = require('../database');

const router = express.Router();



// COMENTARIOS
router.post("/crearnuevo/comentario", function(req, res) {
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


// RUTA NUEVO POST - ESTAN LOS FORM
router.get("/nuevo", function(req, res) {

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
  router.post("/crearnuevo/post", function(req, res) {
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


// RUTA DE LOS POSTEO FILTRADO POR TITULO
router.get("/posts/:id", function(req, res) {
    // Obtenemos con params la id del post
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
                // Vista user logeado
                userInfo: userInfo,
                id: id,
                post: post,
                commentList: commentList
              });
            } else {
              // Vista user no logeado
              res.render("posts", {
                userInfo: userInfo,
                id: id,
                post: post,
                commentList: commentList
              });
          
            }
            });
        }
      );
    });
  });

  
//modulo exporto
module.exports = router;




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
