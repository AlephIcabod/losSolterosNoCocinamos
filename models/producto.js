var conexion=require("../conexion");
var database=conexion.database;
var Sequelize=conexion.Sequelize;

var Producto=database.define("Producto",{
	id_producto: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre_producto:{
		type:Sequelize.STRING
	},
	descripcion:{
		type:Sequelize.STRING
	},
	precio:{
		type:Sequelize.DECIMAL
	},
	categorias:{
		type:Sequelize.JSON
	
	},
	imagenes:{
		type:Sequelize.JSON
	}},
	{
	timestamps: false,
	freezeTableName: false
	}
);


module.exports=Producto;