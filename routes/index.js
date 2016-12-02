var express = require('express');
var router = express.Router();
var login = require("../login");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
  //res.sendFile(__dirname + "/public/templates/inicio.html");  
});

router.post("/signUp", login.registro)
router.post("/login", login.login)
module.exports = router;