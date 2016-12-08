var express = require('express');
var router = express.Router();
var Venta = require("../models/venta");
var DetalleVenta = require("../models/detalleVenta");
var Cliente = require("../models/cliente");
var promocion = require("../models/ProductoPromocion");
var Producto = require("../models/producto");
var path = require("path");
var login = require("../login");


router.get("/", login.autenticarAdmin, function (req, res, next) {
    Venta.findAll({
        where: req.query
      })
      .then(function (data) {
        res.status(200)
          .json({
            ventas: data
          })
      })
  })
  .get("/:id", login.autenticar, function (req, res, next) {
    Venta.findById(req.params.id)
      .then(function (venta) {
        if (venta) {
          venta.getProductos()
            .then(function (p) {
              res.status(200)
                .json({
                  venta: venta,
                  productos: p
                })
            })
        } else {
          res.status(400)
            .json({
              message: "No se ha encontrado la venta"
            });
        }
      });
  })
  .post("/", login.autenticar, function (req, res, next) {
    var productos = req.body.productos;
    var venta = req.body.venta;
    Cliente.findOne({
        where: {
          id_usuario: venta.id_usuario
        }
      })
      .then(function (cliente) {
        if (cliente) {
          var nueva = {
            total: venta.total,
            id_cliente: cliente.id_cliente
          }
          Venta.create(nueva)
            .then(function (v) {
              for (i = 0; i < productos.length - 1; i++) {
                v.addProducto(productos[i].id_producto, {
                    cantidad: productos[i].cantidad,
                    subtotal: productos[i].subtotal
                  })
                  .catch(function (e) {
                    console.log(e);
                  })

              }
              v.addProducto(productos[productos.length - 1].id_producto, {
                  cantidad: productos[productos.length - 1].cantidad,
                  subtotal: productos[productos.length - 1].subtotal
                })
                .then(function (d) {
                  res.status(201)
                    .json({
                      venta: v
                    });
                })
            })
            .catch(function (e) {
              res.status(400)
                .json({
                  message: "No existe el id de usuario"
                });
            })

        } else {
          res.status(400)
            .send("No se encuentra ese cliente");
        }

      })


  })
  .delete("/:id", login.autenticarAdmin, function (req, res) {
    Venta.destroy({
        where: {
          id_venta: req.params.id
        }
      })
      .then(function (n) {
        res.status(200)
          .json({
            message: "Se ha eliminado " + n + " venta"
          });
      });

  });


module.exports = router;