var conexion = require("../conexion");
var database = conexion.database;
var Sequelize = conexion.Sequelize;

var Venta = database.define("Venta", {
    id_venta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    timestamp: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    total: {
      type: Sequelize.DECIMAL,
      field: "total"
    }
  }, {
    timestamps: false,
    freezeTableName: false
  }

);


module.exports = Venta;