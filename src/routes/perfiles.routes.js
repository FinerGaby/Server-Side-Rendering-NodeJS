const express = require('express');

const { client, mongodb }  = require('../database');

const router = express.Router();


// RUTA DE LOS PERFILES PRINCIPAL
router.get('/perfiles/:id', function(req, res) {
    console.log(req.params.id);
    const idperfil = req.params.id;

    client.connect(function (error, client) {
        //elegimos nuestra database
        const db = client.db('dbPrincipal');

        //elegimos la coleccion que usaremos
        const coleccion = db.collection('usuarios');

        // usamos la coleccion especificada filtramos por id y lo convertimos en array
        coleccion.findOne( { _id: new mongodb.ObjectID(req.params.id) },(err, dataperfiles) => {
            console.log(dataperfiles);
            // res render
            let userInfo
            if (req.session.userId !== undefined) {
                userInfo = {
                    userId: req.session.userId,
                    userUsuario: req.session.userUsuario,
                    userAvatar: req.session.userAvatar
                  }
            res.render('perfiles', {
                userInfo: userInfo,
                dataperfiles: dataperfiles
            });
        } else {
            // Vista user no logeado
            res.render('perfiles', {
                userInfo: userInfo,
                dataperfiles: dataperfiles
            });
          }
        });
    });
});


// modulos exporto router
module.exports = router