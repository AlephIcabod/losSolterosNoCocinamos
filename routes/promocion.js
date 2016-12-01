var express = require('express');
var router = express.Router();
var Promocion = require("../models/promocion");
var ProductoPromocion = require("../models/ProductoPromocion");
var Producto = require("../models/producto");
var Sequelize = require("Sequelize");


router.get("/", function (req, res, next) {
    Promocion.findAll({
        include: [{
          model: Producto
        }]
      })
      .then(function (d) {
        res.status(200)
          .json({
            promociones: d
          });
      });
  })
  .get("/:id", function (req, res, next) {
    Promocion.findById(req.params.id)
      .then(function (d) {
        console.log(d)
        if (d) {
          d.getProductos()
            .then(function (p) {
              res.status(200)
                .json({
                  promocion: d,
                  productos: p
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
  .post("/", function (req, res, next) {
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
  .put("/:id", function (req, res, next) {
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
  .delete("/:id", function (req, res, next) {
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