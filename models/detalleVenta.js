var conexion=require("../conexion");
var database=conexion.database;
var Sequelize=conexion.Sequelize;

var DetalleVenta=database.define("DetalleVenta",{	
	cantidad:{
		type:Sequelize.INTEGER		
	},
	subtotal:{
		type:Sequelize.DECIMAL
	}},
	{
	timestamps: false,
	freezeTableName: false
	}
);

module.exports=DetalleVenta;