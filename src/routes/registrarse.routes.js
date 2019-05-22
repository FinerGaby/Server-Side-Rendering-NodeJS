const express = require('express');
const { client, mongodb }  = require('../database');
const router = express.Router();

// Ruta registrarse renderizo los form 
router.get("/registrarse", function(req, res) {
    res.render("registrar");
});

//Ruta registrarse form - obtengo los datos recibidos de los <form>
router.post("/registrarusuario", function(req, res) {

// guardo todos los datos recibidos en una variable
  const reqBodys = {
    usuario: req.body.usuario.toUpperCase(),
    email: req.body.email.toUpperCase(),
    password: req.body.password,
    avatar: req.body.avatar
  };

  // conecto al cliente
  client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("dbPrincipal");
    // ingreso la coleccion que usare
    const coleccion = db.collection("usuarios");
    // obtengo la coleccion con "insertOne" inserto a MongoDB
    coleccion.insertOne(reqBodys, (err, result) => {
        // redirect al login para logearse
      res.redirect("/login");
    });
  });
});

//modulo exporto
module.exports = router;
