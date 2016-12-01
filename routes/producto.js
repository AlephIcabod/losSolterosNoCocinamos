var express = require('express');
var router = express.Router();
var Producto = require("../models/producto");
var Venta = require("../models/venta");
var DetalleVenta = require("../models/detalleVenta");
var sequelize = require("../conexion")
  .database;
var path = require("path");
var multer = require("multer");
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/productos')
  },
  filename: function (req, file, cb) {
    cb(null, "producto-" + Date.now())
  }
});

var upload = multer({
  storage: storage
});
/* GET users listing. */
router.get('/', function (req, res, next) {
    Producto.findAll({
        where: req.query,
        sort: "id_producto"
      })
      .then(function (d) {
        if (d) {
          res.status(200)
            .json({
              productos: d
            });
        } else
          res.status(200)
          .json({
            message: "No hay datos que mostrar"
          })
      });
  })
  .get("/top", function (req, res) {
    Producto.findAll({
        include: [{
          model: Venta
        }]
      })
      .then(function (datos) {
        productos = []
        datos.forEach(function (i) {
          productos.push({
            cantidad: aux(i.Venta),
            id_producto: i.id_producto
          });
        })
        productos.sort(function (a, b) {
          return b.cantidad - a.cantidad
        });
        var top = [];
        for (i = 0; i < 5; i++)
          top.push(productos[i]);
        res.status(200)
          .json({
            productos: productos
          })
      });
  })
  .get("/:id", function (req, res, next) {
    Producto.findById(req.params.id)
      .then(function (d) {
        if (d) {
          res.status(200)
            .json({
              producto: d
            })
        } else {
          res.status(404)
            .json({
              message: "Recurso no encontrado"
            })
        }
      });
  })
  .put("/:id", upload.array("imagenes", 5), function (req, res, next) {
    var files = req.files;
    var productoActualizado = req.body.producto;
    if (files) {
      for (j = 0; j < files.length; j++) {
        productoActualizado.imagenes.push(files[i].path);
      }
      Producto.findById(req.params.id)
        .then(function (d) {
          for (i = 0; i < d.imagenes.length; i++) {
            fs.unlinkSync(d.imagenes[i]);
          }
          Producto.update(productoActualizado, {
              where: {
                id_producto: req.params.id
              },
              returning: true
            })
            .then(function (d) {
              if (d) {
                res.status(200)
                  .json({
                    producto: d[1][0]
                  })
              } else {
                res.status(500)
                  .json({
                    message: "Error al actualizar"
                  });
              }
            })
        });

    } else {
      Producto.update(productoActualizado, {
          where: {
            id_producto: req.params.id
          },
          returning: true
        })
        .then(function (d) {
          if (d) {
            res.status(200)
              .json({
                producto: d
              })
          } else {
            res.status(500)
              .json({
                message: "Error al actualizar"
              });
          }
        })
    }
  })
  .delete("/:id", function (req, res, next) {
    var imagenes;
    Producto.findById(req.params.id)
      .then(function (d) {
        imagenes = d.imagenes;
        Producto.destroy({
            where: {
              id_producto: req.params.id
            }
          })
          .then(function (d) {
            for (i = 0; i < imagenes.length; i++) {
              fs.unlink(imagenes[i])
            }
            res.status(200)
              .json({
                message: "Se han eliminado " + d + " productos"
              });
          });
      });
  });
router.post("/", upload.array("imagenes", 5), function (req, res, next) {
  var producto = {
      nombre_producto: req.body.nombre_producto,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      categorias: [req.body.categorias],
      imagenes: []
    }
    //producto = req.body.producto;
  var files = req.files;
  for (i = 0; i < files.length; i++) {
    producto.imagenes.push(files[i].path);
  }
  Producto.create(producto)
    .then(function (d) {
      res.status(201)
        .json({
          producto: d
        })
    })
});



function aux(ventas) {
  var x = 0;
  ventas.forEach(function (i) {
    x += i.DetalleVenta.cantidad
  });
  return x;
}
module.exports = router;