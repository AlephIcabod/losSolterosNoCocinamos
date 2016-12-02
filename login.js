var service = require("./service");
var config = require("./config");
var jwt = require("jwt-simple");
var moment = require("moment");
var Usuario = require("./models/usuario");


var registro = function (req, res, next) {
  var usuario = {
    username: req.body.username,
    password: req.body.password,
    tipo: req.body.tipo
  };
  usuario.avatar = "public/images/avatar/default.jpg";
  Usuario.create(usuario)
    .then(function (d) {
      if (d.tipo == "admin") aux = true;
      else aux = false;
      res.status(201)
        .json({
          usuario: {
            username: d.username,
            avatar: d.avatar,
            id_usuario: d.id_usuario,
            tipo: d.tipo
          },
          token: service.createToken(d.username, aux)
        });
    })
    .catch(function (e) {
      res.status(400)
        .json({
          message: "Error, nombre de usuario ya existente"
        });
    })
}

var login = function (req, res, next) {
  Usuario.findOne({
      where: {
        username: req.body.username
      }
    })
    .then(function (d) {
      var aux;
      if (d.tipo == "admin") aux = true;
      else aux = false;
      if (d.password === req.body.password)
        res.status(200)
        .json({
          token: service.createToken(d.username, aux)
        })
      else {
        res.status(401)
          .json({
            message: "contraseña incorrecta"
          });
      }
    })
}

var autenticarAdmin = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({
        message: "Tu petición no tiene cabecera de autorización"
      });
  }
  var token = req.headers.authorization;
  var payload = jwt.decode(token, config.token_secret);
  if (payload.exp <= moment()
    .unix()) {
    return res
      .status(401)
      .send({
        message: "El token ha expirado"
      });
  }
  if (payload.admin)
    next();
  else
    res.status(401)
    .json({
      message: "No es un usuario administrador"
    })
};

var autenticar = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({
        message: "Tu petición no tiene cabecera de autorización"
      });
  }
  var token = req.headers.authorization;
  var payload = jwt.decode(token, config.token_secret);
  if (payload.exp <= moment()
    .unix()) {
    return res
      .status(401)
      .send({
        message: "El token ha expirado"
      });
  }
  next();
}
module.exports = {
  registro: registro,
  login: login,
  autenticarAdmin: autenticarAdmin,
  autenticar: autenticar
};