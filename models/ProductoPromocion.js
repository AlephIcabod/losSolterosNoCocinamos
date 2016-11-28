var conexion=require("../conexion");
var database=conexion.database;
var Sequelize=conexion.Sequelize;

var ProductoPromocion=database.define("ProductoPromocion",{		
	nuevoPrecio:{
		type:Sequelize.DECIMAL
	}},
	{
	timestamps: false,
	freezeTableName: false
	}
);

module.exports=ProductoPromocion;