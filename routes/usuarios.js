var express = require('express');
var router = express.Router();
var Usuario = require("../models/usuario");
var path = require("path");
var multer = require("multer");
var fs = require("fs");
var login = require("../login");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, "avatar-" + Date.now() + file.originalname)
  }
})

var upload = multer({
  storage: storage
});
router
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
  .put("/:id", login.autenticar, function (req, res, next) {
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
  .post("/avatar/:id", login.autenticar, upload.single("avatar"), function (req, res, next) {
    var avatar = req.file;
    Usuario.findById(req.params.id)
      .then(function (d) {
        if (d) {
          if (d.avatar !== "uploads/avatar/default.jpg") {
            fs.unlinkSync(d.avatar);
          }
          d.avatar = avatar.path;

          Usuario.update({
              avatar: d.avatar
            }, {
              where: {
                id_usuario: req.params.id
              },
              returning: true
            })
            .then(function (u) {
              if (u[0] > 0) {
                res.status(200)
                  .json({
                    message: "Avatar actualizado correctamente",
                    usuario: u[1][0]
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
  .delete("/:id", login.autenticar, function (req, res, next) {
    Usuario.findById(req.params.id)
      .then(function (d) {
        if (d) {
          if (d.avatar !== "uploads/avatar/default.jpg")
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