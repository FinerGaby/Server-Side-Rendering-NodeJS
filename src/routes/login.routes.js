const express = require('express');
const { client, mongodb }  = require('../database');
const router = express.Router();

// Ruta login renderizo los form 
router.get('/login', function (req, res) {
    res.render('login');
});

//Ruta login form - obtengo los datos recibidos de los <form> para logearme con express session
router.post('/login/form', function (req, res) {
 
  // Recibo los datos del form con req.body
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
      // valido que me llege 1 solo usuario
      if (data.length == 1) {
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


// Ruta de deslogeo para el boton de deslogearse
router.get('/logout', (req, res) => {
  // Destruyo sesión y redirijo al login.
  req.session.destroy();
  res.redirect("/");
});

//modulo exporto rutas
module.exports = router;