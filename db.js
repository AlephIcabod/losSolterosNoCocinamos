var Venta = require("./models/venta");
var Producto = require("./models/producto");
var Cliente = require("./models/cliente");
var Promocion = require("./models/promocion");
var DetalleVenta = require("./models/DetalleVenta");
var ProductoPromocion = require("./models/ProductoPromocion");

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
Venta.belongsTo(Cliente, {
    as: "idCliente",
    foreignKey: "id_cliente"
});
Producto.belongsToMany(Promocion, {
    through: "ProductoPromocion"
});
Promocion.belongsToMany(Producto, {
    through: "ProductoPromocion"
});
Cliente.sync().then(function(e) {
    Venta.sync().then(function(e) {
        Producto.sync().then(function() {
            Promocion.sync().then(function(e) {
                DetalleVenta.sync().then(function(e) {
                    ProductoPromocion.sync().then(function(e) {
                        console.log("Modelos creados");
                    });
                });
            });
        });
    });
});