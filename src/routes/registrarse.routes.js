const express = require('express');
const { client, mongodb }  = require('../database');
const router = express.Router();

var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/avatar')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);        
  }
})

var upload = multer({ storage: storage })

// Ruta registrarse renderizo los form 
router.get("/registrarse", function(req, res) {
    res.render("registrar");
});

//Ruta registrarse form - obtengo los datos recibidos de los <form>
router.post("/registrarusuario", upload.single('avatar'), function(req, res) {

  console.log(req.body);

// guardo todos los datos recibidos en una variable
  const reqBodys = {
    usuario: req.body.usuario.toUpperCase(),
    email: req.body.email.toUpperCase(),
    password: req.body.password,
    avatar: req.file.filename
  };

  const nombrevalidar = req.body.usuario.toUpperCase();

    // conecto al cliente
    client.connect(function(error, client) {
    // ingreso la database que usare
    const db = client.db("dbPrincipal");
    // ingreso la coleccion que usare
    const coleccion = db.collection("usuarios");
    //uso devuelta la coleccion de usuario para validar
    const coleccionvalidar = db.collection("usuarios");

    // filtro si encuentro algun usuario con el mismo nombre me traigo ese array
    coleccionvalidar.find({ usuario: nombrevalidar }).toArray(function(err, datavalidacion) {
      // si encuentro un usuario con el mismo nombre mando un console.log si no inserto los nuevos datos del usuario en else
      if (datavalidacion.length == 1) {
       let errorvalidacion = `Error nombre de usuario utilizado:  ${req.body.usuario}`;
        res.render("registrar", {
          error: errorvalidacion
        });
      } else {
      // obtengo la coleccion con "insertOne" inserto a MongoDB
        coleccion.insertOne(reqBodys, (err, result) => {
        // redirect al login para logearse
          res.redirect("/login");
        });
      }
    })
  });
});

//modulo exporto
module.exports = router;
