const express = require('express');

const { client }  = require('../database');

const router = express.Router();


//RUTA HOME
router.get("/", function(req, res) {
    // Conectamos a MongoDB                      
    client.connect(function(error, client) {
      // Insertamos la database que usaremos
      const db = client.db("dbPrincipal");
      // Especificamos que coleccion usaremos
      let coleccion = db.collection("posts");
      let coleccion2 = db.collection("comentarios");
      let coleccion3 = db.collection("usuarios");
      // Obtenemos la coleccion - find() filtrado - toArray transformamos en un array
      coleccion3.find().toArray(function(err, registrados) {
      coleccion2.find().toArray(function(err, comment) {
        coleccion.find().toArray(function(err, post) {
          // Obtener total de registrados - comentarios - post
          const numberegister = registrados.length;
          const numbercomment = comment.length;
          const numberpost = post.length;
          // Obtengo el array de post por orden de creacion
          const postreverse = post.reverse();
          let userInfo;
          // Validamos si el usuario esta logeado con express session
          if (req.session.userId !== undefined) {
            // Obtenemos los valores del usuario logeado
            userInfo = {
              userId: req.session.userId,
              userUsuario: req.session.userUsuario,
              userAvatar: req.session.userAvatar
            }
            //Renderizamos handlebars
          res.render("home", {
            // Vista user Logeado
            userInfo: userInfo,
            numberegister: numberegister,
            numbercomment: numbercomment,
            numberpost: numberpost,
            postreverse: postreverse
          });
        } else {
          // Vista user no logeado
          res.render("home", {
            userInfo: userInfo,
            numberegister: numberegister,
            numbercomment: numbercomment,
            numberpost: numberpost,
            postreverse: postreverse
          });
      
        }
        });
      });
      });
    });
  });


  
//modulo exporto
module.exports = router;