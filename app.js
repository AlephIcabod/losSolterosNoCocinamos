var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");
var routes = require('./routes/index');

//rutas api
var usuario = require("./routes/usuarios");
var producto = require('./routes/producto');
var promocion = require("./routes/promocion");
var cliente = require("./routes/cliente");
var conexion = require("./conexion");
var venta = require("./routes/ventas");

var app = express();

var db = require("./db");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
  // uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'logo.png')));

app.use(logger('dev'));
app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));
app.use(cookieParser());



app.get("/app", function (req, res) {
  res.sendFile(__dirname + "/public/templates/inicio.html");
})

app.use(express.static("public"))
app.use('/', routes);
app.use('/api/producto', producto);
app.use("/api/cliente", cliente);
app.use("/api/usuario", usuario);
app.use("/api/promocion", promocion);
app.use("/api/venta", venta);
app.use("/uploads", express.static('uploads'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;