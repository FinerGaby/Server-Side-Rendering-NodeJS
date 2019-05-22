const express = require("express");
const app = express();
const expressSession = require('express-session');
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const path = require("path");
const port = 3000;
const bodyParser = require("body-parser");


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


// Routes de la la base

// Ruta el home muestra todo los posts
app.use('/', require('./routes/home.routes'))

// Ruta dentro de los posts - comentarios <form>
app.use('/', require('./routes/posts.routes'))

// Ruta editar <form>
app.use('/', require('./routes/editar.routes'))

// Ruta registrarse <form>
app.use('/', require('./routes/registrarse.routes'))

// Ruta login <form>
app.use('/', require('./routes/login.routes'))

// Ruta de los perfiles
app.use('/', require('./routes/perfiles.routes'))



// Starting The Server
app.listen(port, function() {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
