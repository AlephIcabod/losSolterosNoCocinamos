(function () {
  var app = angular.module("app", ["ngRoute", "satellizer"])
    .controller("loginController", ["$scope", "$auth", "$location", function ($scope, $auth, $location) {
      var control = this;
      control.username;
      control.password;
      this.login = function () {
        control.error = false;
        $auth.login({
            username: control.username,
            password: control.password
          })
          .then(function (d) {
            $scope.$parent.usuario = d.data.id_usuario;
            $scope.$parent.logeado = true;
            if ($auth.getPayload()
              .admin) {
              $location.path("/admin");
              $scope.$parent.admin = true;
            } else
              $location.path("/cuenta");

          })
          .catch(function (e) {
            control.error = true;
          })
      }
    }])
    .controller("signUpController", ["$scope", "$auth", "$location", function ($scope, $auth, $location) {
      var control = this;
      control.tipo = "cliente";
      this.signup = function () {
        if (control.password === control.confirmPassword) {
          $auth.signup({
              username: control.username,
              password: control.password,
              tipo: control.tipo,
              email: control.email
            })
            .then(function (d) {
              $auth.login({
                  username: d.data.usuario.username,
                  password: control.password
                })
                .then(function (d) {
                  $scope.$parent.usuario = d.data.id_usuario;
                  $scope.$parent.logeado = true;
                  $scope.$parent.email = d.data.email;
                  $location.path("/registro-cliente");
                })
                .catch(function (e) {
                  control.error = true;
                })
            })
            .catch(function (response) {
              control.errorUsuario = true;
            });
        } else {
          control.error = true;

        }
      }
    }])
    .controller("logOutController", [])
    .config(function ($routeProvider, $authProvider) {

      $authProvider.loginUrl = "/login";
      $authProvider.signupUrl = "/signup";
      $authProvider.tokenName = "token";
      $authProvider.tokenPrefix = "lsnc";

      //Configuracion de rutas
      $routeProvider.when("/", {
          controller: "homeController",
          controllerAs: "control",
          templateUrl: "templates/home.html",
          authenticated: false
        })
        .when("/producto/:id", {
          controller: "productoController",
          controllerAs: "control",
          templateUrl: "templates/producto.html",
          authenticated: false
        })
        .when("/admin", {
          controller: "adminController",
          controllerAs: "control",
          templateUrl: "templates/admin.html",
          resolve: {
            mostrar: revisarAdmin
          }
        })
        .when("/cuenta", {
          controller: "cuentaController",
          controllerAs: "control",
          templateUrl: "templates/cuenta.html",
          resolve: {
            mostrar: revisar
          }
        })
        .when("/login", {
          controller: "loginController",
          controllerAs: "control",
          templateUrl: "templates/login.html",
          authenticated: false,
          resolve: {
            skip: omitir
          }
        })
        .when("/signup", {
          controller: "signUpController",
          controllerAs: "control",
          templateUrl: "templates/signup.html",
          authenticated: false,
          resolve: {
            skip: omitir
          }
        })
        .when("/carrito", {
          controller: "carritoController",
          controllerAs: "control",
          templateUrl: "templates/carrito.html",
          authenticated: true
        })
        .when("/postres", {
          controller: "categoriaController",
          controllerAs: "control",
          templateUrl: "templates/categoria.html",
        })
        .when("/bebidas", {
          controller: "categoriaController",
          controllerAs: "control",
          templateUrl: "templates/categoria.html",
        })
        .when("/comidas", {
          controller: "categoriaController",
          controllerAs: "control",
          templateUrl: "templates/categoria.html",
        })
        .when("/promociones", {
          controller: "promocionesController",
          controllerAs: "control",
          templateUrl: "templates/promociones.html",
        })
        .when("/registro-cliente", {
          controller: "registroController",
          controllerAs: "control",
          templateUrl: "templates/registro.html"
        })
        .otherwise("/")
    })
})();


function omitir($q, $auth, $location) {
  var defer = $q.defer();
  if ($auth.isAuthenticated()) {
    if ($auth.getPayload()
      .admin)
      $location.path("/admin")
    else
      $location.path("/cuenta")
  } else {
    defer.resolve(); /* (2) */
  }
  return defer.promise;
}

function revisar($q, $auth, $location) {
  var defer = $q.defer()
  if ($auth.isAuthenticated()) {
    defer.resolve();
  } else {
    $location.path("/login");
  }
}


function revisarAdmin($q, $auth, $location) {
  var defer = $q.defer()
  if ($auth.isAuthenticated() && $auth.getPayload()
    .admin) {
    defer.resolve();
  } else {
    $location.path("/login");
  }
}