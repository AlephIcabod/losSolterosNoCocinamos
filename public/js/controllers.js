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
        var aux = -1;
        for (i = 0; i < carrito.productos.length; i++) {
          if (carrito.productos[i].id_producto === item.id_producto && carrito.productos[i].precio_unitario === item.precio_unitario) {
            aux = i;
            break;
          }
        }
        if (aux < 0) {
          carrito.productos.push(item);
        } else {
          carrito.productos[aux].cantidad += item.cantidad;
          carrito.productos[aux].subtotal += item.subtotal;
        }
        carrito.venta.total += item.subtotal;
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
      },
      actualizarCarrito: function (carrito) {
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        return JSON.parse(sessionStorage.getItem("carrito"));
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
      $scope.admin = false;
      $scope.username = "";
    }
  }])
  .controller("registroController", ["$scope", "$location", "$http", function ($scope, $location, $http) {
    if ($scope.$parent.usuario === undefined || $scope.$parent.email === undefined)
      $location.path("/signup")
    var control = this;
    control.cliente = {};
    control.cliente.nombre = "Nombre";
    this.registrar = function () {
      var cliente = {
        correo: $scope.$parent.email,
        id_usuario: $scope.$parent.usuario,
        direccion: control.direccion,
        telefono: control.telefono,
        num_tarjeta: control.num_tarjeta,
        nombre: control.cliente.nombre
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
    control.categoria = "Todos los productos";
    peticiones.getProductos()
      .success(function (d) {
        control.productos = d.productos;
      });
  }])
  .controller("productoController", ["peticiones", "$routeParams", function (peticiones, $routeParams) {
    var control = this;
    this.producto;
    control.promociones = [];
    control.tienePromocion = false;
    peticiones.getProducto($routeParams.id)
      .success(function (d) {
        control.producto = d.producto;
        control.promociones = d.promociones;
        if (d.promociones.length > 0)
          control.tienePromocion = true;
      });


    peticiones.getPromociones()
      .success(function (d) {
        console.log(d);
        control.promos = d.promociones;
      })


    this.agregarAlCarrito = function () {
      var pro = {
        id_producto: control.producto.id_producto,
        cantidad: control.cantidad,
        nombre_producto: control.producto.nombre_producto,
        thumbnail: control.producto.imagenes[0],
        precio_unitario: control.producto.precio
      }
      if (control.producto.precioPromocion != undefined && control.producto.precioPromocion !== "") {
        pro.precio_unitario = control.producto.precioPromocion;
      }
      pro.subtotal = pro.cantidad * pro.precio_unitario
      peticiones.agregarAlCarrito(pro)
      peticiones.getCarrito()
      control.agregado = true;
    }
  }])
  .controller("cuentaController", ["$scope", "$http", "$auth", "$location", function ($scope, $http, $auth, $location) {

    if ($scope.$parent.usuario === undefined) {
      $auth.logout();
      $location.path("/login")
    }
    var control = this;
    control.usuario;
    $http.get("/api/cliente/" + $scope.$parent.usuario)
      .success(function (d) {
        control.usuario = d.usuario;
        control.cliente = d.cliente;
        control.sinGuardar = JSON.parse(JSON.stringify(control.cliente));

      })
      .error(function (e) {
        console.log(e)
      })

    $http.get("/api/cliente/" + $scope.$parent.usuario + "/ventas")
      .success(function (d) {
        control.compras = d.ventas;
      })
      .catch(function (e) {
        console.log(e)
      })

    this.deshacer = function () {
      control.cliente = control.sinGuardar;
    }

    this.actualizarDatos = function () {
      $http.put("/api/cliente/" + control.cliente.id_cliente, {
          cliente: control.cliente
        })
        .success(function (d) {
          control.cliente = d.cliente;
          control.sinGuardar = JSON.parse(JSON.stringify(control.cliente));
        })
    }

    this.enviar = function () {
      var file = control.avatar;
      var fd = new FormData();
      fd.append('avatar', file);
      $http.post('/api/usuario/avatar/' + $scope.$parent.usuario, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })
        .success(function (response) {
          control.usuario = response.usuario;
        })
        .error(function (response) {
          console.log("error", response)
        });
    }




  }])
  .controller("adminController", [function () {
    console.log("admin")
  }])
  .controller("carritoController", ["$scope", "peticiones", "$auth", "$http", "$location", function ($scope, peticiones, $auth, $http, $location) {
    var control = this;
    this.pagoRealizado = false;
    if (peticiones.getCarrito() == null) {
      this.carrito = {
        productos: [],
        venta: {}
      }
    } else {
      this.carrito = peticiones.getCarrito()
    }
    this.eliminar = function (id_producto, precio_unitario) {
      control.carrito.productos.forEach(function (i) {
        if (i.id_producto == id_producto && i.precio_unitario == parseInt(precio_unitario)) {
          control.carrito.venta.total -= i.subtotal;
        }
      })
      control.carrito.productos = control.carrito.productos.filter(function (item) {
        if (item.id_producto != id_producto || item.precio_unitario != precio_unitario)
          return item;
      })
      control.carrito = peticiones.actualizarCarrito(control.carrito);
    }

    this.cambio = function (i) {
      var a = control.carrito.productos[i];
      control.carrito.venta.total -= a.subtotal;
      a.subtotal = a.cantidad * a.precio_unitario;
      control.carrito.venta.total += a.subtotal;
      control.carrito = peticiones.actualizarCarrito(control.carrito);
    }

    this.pagar = function () {
      if ($auth.isAuthenticated() && $scope.$parent.usuario != undefined) {
        var peticion = {};
        peticion.productos = control.carrito.productos.map(function (i) {
          return {
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            subtotal: i.subtotal
          }
        })
        peticion.venta = {
          total: control.carrito.venta.total,
          id_usuario: $scope.$parent.usuario
        }
        $http.post("/api/venta", peticion)
          .success(function (d) {
            peticiones.actualizarCarrito({
              productos: [],
              venta: {}
            });
            control.carrito = peticiones.getCarrito();
            control.pagoRealizado = true;

          })
          .catch(function (e) {
            console.log("error", e)
          })

      } else {
        $location.path("/login")
      }
    }
  }])
  .controller("categoriaController", ["$location", "peticiones", function ($location, peticiones) {
    var control = this;
    categoria = $location.path()
      .substring(1);
    var categoria = categoria.substring(0, categoria.length - 1)
    this.categoria = categoria[0].toUpperCase() + categoria.substring(1) + "s";
    peticiones.getProductos()
      .success(function (d) {
        control.productos = d.productos.filter(function (i) {
          if (i.categorias[0] == categoria)
            return i;
        });
      })


  }])
  .controller("promocionesController", ["$http", function ($http) {
    var control = this;
    $http.get("/api/promocion")
      .success(function (d) {
        console.log(d);
        control.promociones = d.promociones;
      })


  }])
  .controller("promocionController", ["$routeParams", "$http", function ($routeParams, $http) {
    var control = this;
    var id = $routeParams.id;
    $http.get("/api/promocion/" + id)
      .success(function (d) {
        control.productos = d.productos;
        control.promocion = d.promocion;
      })
  }])
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);