var express = require('express');
var router = express.Router();
var Usuario = require("../models/usuario");
var path = require("path");
var multer = require("multer");
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, "avatar-" + Date.now())
  }
})

var upload = multer({
  storage: storage
});

router.post("/", upload.single("avatar"), function (req, res, next) {
    var avatar = req.file;
    var usuario = req.body.usuario;
    if (avatar === null || avatar === undefined) {
      usuario.avatar = "public/images/avatar/default.jpg";
    } else {
      usuario.avatar = avatar.path;
    }
    Usuario.create(usuario)
      .then(function (d) {
        res.status(201)
          .json({
            usuario: {
              username: d.username,
              avatar: d.avatar,
              id_usuario: d.id_usuario,
              tipo: d.tipo
            }
          });
      })
      .catch(function (e) {
        res.status(500)
          .json({
            message: "Error, nombre de usuario ya existente"
          });
      })
  })
  .get("/:id", function (req, res, next) {
    Usuario.findById(req.params.id)
      .then(function (d) {
        if (d) {
          d.password = undefined;
          res.status(200)
            .json({
              usuario: d
            })
        } else {
          res.status(404)
            .json({
              message: "usuario no encontrado"
            })
        }
      })
  })
  .put("/:id", function (req, res, next) {
    console.log(req.params.id)
    var actualizacion = {
      password: req.body.password
    };
    Usuario.update(actualizacion, {
        where: {
          id_usuario: req.params.id
        },
        returning: true
      })
      .then(function (d) {
        if (d[0] > 0) {
          d[1][0].password = undefined;
          res.status(200)
            .json({
              usuario: d[1][0]
            })
        } else {
          res.status(200)
            .json({
              message: "No se actualizo ningun usuario"
            });
        }
      })
  })
  .put("/:id/avatar", upload.single("avatar"), function (req, res, next) {
    var avatar = req.file;
    Usuario.findById(req.params.id)
      .then(function (d) {
        if (d) {
          if (d.avatar !== "public/images/avatar/default.jpg") {
            fs.unlinkSync(d.avatar);
          }
          d.avatar = avatar.path;
          Usuario.update(d, {
              where: {
                id_usuario: req.params.id
              },
              returning: true
            })
            .then(function (d) {
              if (d[0] > 0) {
                res.status(200)
                  .json({
                    message: "Avatar actualizado correctamente",
                    usuario: d[1][0]
                  })
              } else {
                res.status(500)
                  .json({
                    message: "Error al actualizar avatar"
                  });
              }
            });
        } else {
          res.status(404)
            .json({
              message: "Usuario no encontrado"
            });
        }
      })
  })
  .delete("/:id", function (req, res, next) {
    Usuario.findById(req.params.id)
      .then(function (d) {
        if (d) {
          if (d.avatar !== "public/images/avatar/default.jpg")
            fs.unlinkSync(d.avatar);
          Usuario.destroy({
              where: {
                id_usuario: req.params.id
              }
            })
            .then(function (n) {
              res.status(200)
                .json({
                  message: "Se ha eliminado " + n + " usuario"
                });
            });
        } else {
          res.status(400)
            .json({
              message: "Usuario no encontrado"
            });
        }
      })
  });

module.exports = router