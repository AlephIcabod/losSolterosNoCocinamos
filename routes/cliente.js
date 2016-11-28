var express = require('express');
var router = express.Router();
var Cliente = require("../models/cliente");


router.get("/",function(req, res, next) {
	Cliente.findAll({where:req.query})
	.then(function(d){
		if(d){
			res.status(200)
			.json({clientes:d})
		}else{
			res.status(200)
			.json({message:"No hay clientes que mostrar"});
		}
	});
})
.get("/:id",function(req,res,next){
	Cliente.findById(req.params.id)
	.then(function(d){
		if(d){
			res.status(200)
			.json({cliente:d})
		}else{
			res.status(404)
			.json({message:"Cliente no encontrado"});
		}
	})
})
.post("/",function(req, res, next){
	Cliente.create(req.body.cliente)
		.then(function(d){
			if(d){
				res.status(201)
				.json({cliente:d})
			}else{
				res.status(500)
				.json({message:"No se pudo crear el recurso cliente"})
			}
		});
})
.put("/:id",function(req,res,next){
	Cliente.update(req.body.cliente,{where:{id_cliente:req.params.id},returning:true})
	.then(function(d,i){
		if(d){
			res.status(200)
			.json({cliente:d[1][0]})
		}else{
			res.status(500)
			.json({message:"Error al actualizar"});
		}
	})
})
.delete("/:id",function(req,res,next){
	Cliente.destroy({where:{id_cliente:req.params.id}})
	.then(function(n){
		res.status(200)
		.json({message:"Se ha eliminado "+n +" registros"});
	})
})


module.exports=router;