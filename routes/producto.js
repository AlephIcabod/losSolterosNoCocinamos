var express = require('express');
var router = express.Router();
var Producto = require("../models/producto");
/* GET users listing. */

router.get('/', function(req, res, next) {
        Producto.findAll({
                where: req.query
            })
            .then(function(d) {
                if (d) {
                    res.status(200)
                        .json({
                            productos: d
                        });
                } else
                    res.status(200).json({
                        message: "No hay datos que mostrar"
                    })
            });
    })
    .get("/:id", function(req, res, next) {
        Producto.findById(req.params.id)
            .then(function(d) {
                if (d) {
                    res.status(200)
                        .json({
                            producto: d[1][0]
                        })
                } else {
                    res.status(404)
                        .json({
                            message: "Recurso no encontrado"
                        })
                }
            });
    })
    .post("/", function(req, res, next) {
        Producto.create(req.body.producto)
            .then(function(d) {
                if (d) {
                    res.status(201)
                        .json({
                            producto: d
                        })
                } else {
                    res.status(500)
                        .json({
                            message: "Error al crear producto"
                        });
                }
            });
    })
    .put("/:id", function(req, res, next) {
        Producto.update(req.body.producto, {
                where: {
                    id_producto: req.params.id
                },
                returning: true
            })
            .then(function(d) {
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
    })
    .delete("/:id",function(req,res,next){
    	Producto.destroy({where:{id_producto:req.params.id}})
    	.then(function(d){
    		console.log(d);
    		res.status(200).json({message:"Se han eliminado "+ d+" productos"
    		});
    	})
    });

module.exports = router;