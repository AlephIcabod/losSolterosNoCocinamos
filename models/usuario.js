var conexion=require("../conexion");
var database=conexion.database;
var Sequelize=conexion.Sequelize;

var Usuario=database.define("Usuario",{
	id_usuario: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true		
	},
	username:{
		type:Sequelize.STRING,
		unique:true
	},
	password:{
		type:Sequelize.STRING
	},
	avatar:{
		type:Sequelize.STRING
	},
	tipo:{
		type:Sequelize.STRING
	}
	},
	{
	timestamps: false,
	freezeTableName: false,	
	}
);


module.exports=Usuario;