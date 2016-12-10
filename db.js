var Venta = require("./models/venta");
var Producto = require("./models/producto");
var Cliente = require("./models/cliente");
var Promocion = require("./models/promocion");
var DetalleVenta = require("./models/DetalleVenta");
var ProductoPromocion = require("./models/ProductoPromocion");
var Usuario = require("./models/usuario");

Venta.belongsToMany(Producto, {
  through: "DetalleVenta"
});
Producto.belongsToMany(Venta, {
  through: "DetalleVenta"
});
Cliente.hasMany(Venta, {
  as: "idCliente",
  foreignKey: "id_cliente"
});

Producto.belongsToMany(Promocion, {
  through: "ProductoPromocion"
});
Promocion.belongsToMany(Producto, {
  through: "ProductoPromocion"
});
Cliente.belongsTo(Usuario, {
  as: "idUsuario",
  foreignKey: "id_usuario"
})
Usuario.sync({
    force: true
  })
  .then(function (e) {
    Cliente.sync({
        force: true
      })
      .then(function (e) {
        Venta.sync()
          .then(function (e) {
            Producto.sync()
              .then(function () {
                Promocion.sync()
                  .then(function (e) {
                    DetalleVenta.sync()
                      .then(function (e) {
                        ProductoPromocion.sync()
                          .then(function (e) {
                            console.log("Modelos creados");
                          });
                      });
                  });
              });
          });
      });
    Usuario.create({
        username: "administrador",
        password: "root",
        tipo: "admin",
        email: "admin@admin.com"
      })
      .then(function (d) {
        console.log("creado usuario administrador");
      })
  });