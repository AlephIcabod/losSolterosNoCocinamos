var conexion=require("../conexion");
var database=conexion.database;
var Sequelize=conexion.Sequelize;

var Cliente=database.define("Cliente",{
	id_cliente: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true		
	},
	nombre:{
		type:Sequelize.STRING
	},
	direccion:{
		type:Sequelize.STRING
	},
	telefono:{
		type:Sequelize.STRING
	},
	num_tarjeta:{
		type:Sequelize.STRING
	},
	avatar:{
		type:Sequelize.STRING
	},
	correo:{type:Sequelize.STRING}},
	{
	timestamps: false,
	freezeTableName: false,	
	}
);


module.exports=Cliente;