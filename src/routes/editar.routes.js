const express = require('express');
const { client, mongodb }  = require('../database');
const router = express.Router();


// Ruta editar obtengo filtrado por ID de los posts
router.get("/editar/:id", function(req, res) {

    // Obtengo la id con req.params la guardo en variable
    const id = req.params.id;

    //conecto al cliente
    client.connect(function(error, client) {
        // ingreso mi database que usare
      const db = client.db("dbPrincipal");
      // ingreso la coleccion que usare
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
  router.post("/editar/post", function(req, res) {
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
  
  
//modulo exporto
module.exports = router;