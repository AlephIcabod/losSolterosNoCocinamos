var conexion=require("../conexion");
var database=conexion.database;
var Sequelize=conexion.Sequelize;

var Promocion=database.define("Promocion",{
	id_promocion: {
		type: Sequelize.INTEGER,	
		primaryKey: true,
		autoIncrement: true		
	},
	descripcion:{
		type:Sequelize.STRING
	},
	tipo:{
		type:Sequelize.STRING
	},
	vigencia:{
		type:Sequelize.DATE
	}},
	{
	timestamps: false,
	freezeTableName: false	
});

module.exports=Promocion;