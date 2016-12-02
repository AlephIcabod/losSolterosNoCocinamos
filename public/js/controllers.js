var app = angular.module("app")
  .factory("peticiones", function ($http) {
    return {
      getProductos: function () {
        return $http.get("/api/producto")
      },
      getProducto: function (id) {
        return $http.get("/api/producto/" + id)
      },
      getPromociones: function () {
        return $http.get("/api/promocion")
      },
      getCarrito: function () {
        return JSON.parse(sessionStorage.getItem("carrito"));
      },
      agregarAlCarrito: function (item) {
        if (!sessionStorage.getItem("carrito")) {
          var id_cliente = sessionStorage.getItem("id_cliente") || 1;
          sessionStorage.setItem("carrito", JSON.stringify({
            productos: [],
            venta: {
              total: 0,
              id_cliente: id_cliente
            }
          }));
        }
        var carrito = JSON.parse(sessionStorage.getItem("carrito"));
        carrito.productos.push(item);
        carrito.venta.total += item.subtotal;
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
      }
    }
  })
  .controller("homeController", ["peticiones", function (peticiones) {
    var control = this;
    this.productos;
    peticiones.getProductos()
      .success(function (d) {
        control.productos = d.productos;
      });

  }])
  .controller("productoController", ["peticiones", "$routeParams", function (peticiones, $routeParams) {
    var control = this;
    this.producto;
    peticiones.getProducto($routeParams.id)
      .success(function (d) {
        control.producto = d.producto;
      });
    this.promociones;
    peticiones.getPromociones()
      .success(function (d) {
        control.promociones = d.promociones;
      })
    this.agregarAlCarrito = function () {
      var pro = {
        id_producto: control.producto.id_producto,
        cantidad: control.cantidad,
        subtotal: control.cantidad * control.producto.precio
      }
      peticiones.agregarAlCarrito(pro)
      peticiones.getCarrito()
    }
  }])
  .controller("cuentaController", [function () {

  }]);