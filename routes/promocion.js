var express = require('express');
var router = express.Router();
var Promocion = require("../models/promocion");
var ProductoPromocion = require("../models/ProductoPromocion");
var Producto = require("../models/producto");
var Sequelize = require("Sequelize");
var login = require("../login");

router.get("/", function (req, res, next) {
    Promocion.findAll({
        include: [{
          model: Producto
        }]
      })
      .then(function (d) {
        var aux = d.map(function (item) {
          item.Productos = item.Productos.map(function (pro) {
            return {
              id_producto: pro.id_producto,
              nombre_producto: pro.nombre_producto,
              precio: pro.precio,
              precioPromocion: pro.ProductoPromocion.nuevoPrecio,
              descripcion: pro.descripcion,
              imagenes: pro.imagenes
            }
          });
          return {
            Productos: item.Productos,
            id_promocion: item.id_promocion,
            descripcion: item.descripcion,
            vigencia: item.vigencia,
            tip: item.tipo
          }
        })
        res.status(200)
          .json({
            promociones: aux
          });
      });
  })
  .get("/:id", function (req, res, next) {
    Promocion.findById(req.params.id)
      .then(function (d) {
        if (d) {
          d.getProductos()
            .then(function (p) {
              var aux = p.map(function (i) {
                return {
                  id_producto: i.id_producto,
                  nombre_producto: i.nombre_producto,
                  precio: i.precio,
                  precioPromocion: i.ProductoPromocion.nuevoPrecio,
                  descripcion: i.descripcion,
                  imagenes: i.imagenes
                }
              })

              res.status(200)
                .json({
                  promocion: d,
                  productos: aux
                });
            })

        } else {
          res.status(400)
            .json({
              message: "No se ha encontrado promocion"
            })
        }
      })
  })
  .post("/", login.autenticarAdmin, function (req, res, next) {
    var productos = [];
    for (i = 0; i < req.body.productos.length; i++) {
      productos.push(req.body.productos[i]);
    };
    var promocion = req.body.promocion;
    Promocion.create(promocion)
      .then(function (promo) {
        var id = promo.id_promocion;
        promo.setProductos(productos, {
            nuevoPrecio: promocion.nuevoPrecio
          })
          .then(function (d) {
            Promocion.findById(id)
              .then(function (r) {
                if (r) {
                  r.getProductos()
                    .then(function (d) {
                      res.status(201)
                        .json({
                          promocion: r,
                          productos: d
                        })
                    })
                }
              });
          });
      })
      .catch(function (e) {
        res.status(500)
          .json({
            message: "No se ha podido crear la promocion"
          });
      });
  })
  .put("/:id", login.autenticarAdmin, function (req, res, next) {
    var productos = [];
    for (i = 0; i < req.body.productos.length; i++) {
      productos.push(req.body.productos[i]);
    };
    var promocion = req.body.promocion;
    Promocion.findById(req.params.id)
      .then(function (promo) {
        promo.setProductos(productos, {
            nuevoPrecio: promocion.nuevoPrecio
          })
          .then(function (r) {
            Promocion.update(promocion, {
                where: {
                  id_promocion: req.params.id
                },
                returning: true
              })
              .then(function (p) {
                p[1][0].getProductos()
                  .then(function (d) {
                    res.status(200)
                      .json({
                        promocion: p[1][0],
                        productos: d

                      });
                  });
              });
          });
      });
  })
  .delete("/:id", login.autenticarAdmin, function (req, res, next) {
    Promocion.destroy({
        where: {
          id_promocion: req.params.id
        }
      })
      .then(function (n) {
        res.status(200)
          .json({
            message: "Se ha eliminado " + n + " promocion"
          });
      });
  });





module.exports = router;