var express = require('express');
var router = express.Router();
var Cliente = require("../models/cliente");
var Usuario = require("../models/usuario");
var Venta = require("../models/venta")
var multer = require("multer");
var fs = require("fs");
var login = require("../login");
var Producto = require("../models/producto")

router.get("/", login.autenticarAdmin, function (req, res, next) {
    Cliente.findAll({
        where: req.query
      })
      .then(function (d) {
        if (d) {
          res.status(200)
            .json({
              clientes: d
            })
        } else {
          res.status(200)
            .json({
              message: "No hay clientes que mostrar"
            });
        }
      });
  })
  .get("/:id", login.autenticar, function (req, res, next) {
    Usuario.findById(req.params.id)
      .then(function (u) {
        if (u) {
          Cliente.findOne({
              where: {
                id_usuario: req.params.id
              }
            })
            .then(function (d) {
              if (d) {
                res.status(200)
                  .json({
                    cliente: d,
                    usuario: {
                      id_usuario: u.id_usuario,
                      email: u.email,
                      avatar: u.avatar,
                      username: u.username
                    }
                  })
              } else {
                res.status(404)
                  .json({
                    message: "Cliente no encontrado"
                  });
              }
            })
        } else {
          req.status(404)
            .send("Usuario no encontrado")
        }

      })

  })
  .get("/:id/ventas", login.autenticar, function (req, res, next) {
    Cliente.findOne({
        where: {
          id_usuario: req.params.id
        }
      })
      .then(function (cliente) {
        if (cliente) {
          var id = cliente.id_cliente;
          Venta.findAll({
              where: {
                id_cliente: id
              },
              include: [{
                model: Producto
              }]
            })
            .then(function (ventas) {
              res.status(200)
                .json({
                  cliente: cliente,
                  ventas: ventas
                })
            })
        } else {
          res.status(400)
            .json({
              message: "No se ha encontrado cliente"
            })
        }
      });
  })
  .post("/", login.autenticar, function (req, res, next) {
    Usuario.findById(req.body.cliente.id_usuario)
      .then(function (d) {
        if (d) {
          Cliente.create(req.body.cliente)
            .then(function (d) {
              if (d) {
                res.status(201)
                  .json({
                    cliente: d
                  })
              } else {
                res.status(400)
                  .json({
                    message: "No se pudo crear el recurso cliente"
                  })
              }
            });
        } else {
          res.status(400)
            .json({
              message: "No se puede crear un cliente sin usuario"
            });
        }
      })
      .catch(function (e) {
        res.status(400)
          .json({
            message: "No se ha podido crear el cliente"
          });
      });

  })
  .put("/:id", login.autenticar, function (req, res, next) {
    Cliente.update(req.body.cliente, {
        where: {
          id_cliente: req.params.id
        },
        returning: true
      })
      .then(function (d, i) {
        if (d) {
          Usuario.update({
              correo: d[1][0].correo
            }, {
              where: {
                id_usuario: d[1][0].id_usuario
              }
            })
            .then(function (u) {
              if (u) {
                res.status(200)
                  .json({
                    cliente: d[1][0]
                  })
              } else {
                res.status(500)
                  .send("Error al actualizar");
              }
            })
        } else {
          res.status(500)
            .json({
              message: "Error al actualizar"
            });
        }
      })
  })
  .delete("/:id", login.autenticarAdmin, function (req, res, next) {
    Cliente.destroy({
        where: {
          id_cliente: req.params.id
        }
      })
      .then(function (n) {
        res.status(200)
          .json({
            message: "Se ha eliminado " + n + " registros"
          });
      })
  })


module.exports = router;