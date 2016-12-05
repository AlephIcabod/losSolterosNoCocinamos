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
          sessionStorage.setItem("carrito", JSON.stringify({
            productos: [],
            venta: {
              total: 0
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
  .controller("navController", ["$scope", "$location", "$auth", function ($scope, $location, $auth) {
    var control = this;
    $scope.logeado = $auth.isAuthenticated();
    control.salir = function () {
      $auth.logout()
      $location.path("/");
      $scope.logeado = false;
    }
  }])
  .controller("registroController", ["$scope", "$location", "$http", function ($scope, $location, $http) {
    if ($scope.$parent.usuario === undefined || $scope.$parent.email === undefined)
      $location.path("/signup")
    var control = this;

    this.registrar = function () {
      var cliente = {
        correo: $scope.$parent.email,
        id_usuario: $scope.$parent.usuario,
        direccion: control.direccion,
        telefono: control.telefono,
        num_tarjeta: control.num_tarjeta,
        nombre: control.nombre
      };
      $http.post("/api/cliente/", {
          cliente: cliente
        })
        .success(function (d) {
          $scope.$parent.usuario = d.cliente.id_usuario;
          $location.path("/cuenta");
        })
        .catch(function (e) {
          console.log("error", e)
        })
    }

  }])
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
  .controller("cuentaController", ["$scope", "$http", "$auth", "$location", function ($scope, $http, $auth, $location) {
    console.log($scope.$parent.usuario)
    if ($scope.$parent.usuario === undefined) {
      $auth.logout();
      $location.path("/login")
    }
    var control = this;
    control.usuario;
    $http.get("/api/usuario/" + $scope.$parent.usuario)
      .success(function (d) {
        control.usuario = d.usuario;
      })
      .error(function (e) {
        console.log(e)
      })
  }])
  .controller("adminController", [function () {
    console.log("admin")
  }])
  .controller("carritoController", [function () {

  }])
  .controller("categoriaController", ["$location", function ($location) {

  }])
  .controller("promocionesController", [function () {}]);