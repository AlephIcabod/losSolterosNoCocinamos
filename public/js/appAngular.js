(function () {
  var app = angular.module("app", ["ngRoute", "satellizer"])
    .controller("loginController", ["$scope", "$auth", "$location", function ($scope, $auth, $location) {
      console.log("corriendo");
      var control = this;
      control.username;
      control.password;
      this.login = function () {
        $auth.login({
            username: control.username,
            password: control.password
          })
          .then(function (d) {
            $scope.$parent.usuario = d.data.id_usuario;
            console.log($scope.$parent)
            $location.path("/cuenta");
          })
          .catch(function (e) {
            console.log(e);
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
                  console.log($scope.$parent)
                  $location.path("/cuenta");
                })
                .catch(function (e) {
                  console.log(e);
                })

            })
            .catch(function (response) {
              console.log(response)
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
        .otherwise("/")
    })
})();


function omitir($q, $auth, $location) {
  var defer = $q.defer();
  if ($auth.isAuthenticated()) {
    $location.path("/cuenta")
  } else {
    defer.resolve(); /* (2) */
  }
  return defer.promise;
}

function revisar($q, $auth, $location) {
  var defer = $q.defer()
  if ($auth.isAuthenticated()) {
    console.log("hay un usuario");
    defer.resolve();
  } else {
    $location.path("/login");
  }
}