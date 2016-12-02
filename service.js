var jwt = require("jwt-simple"),
  moment = require("moment"),
  config = require("./config");


exports.createToken = function (username, admin) {
  var payload = {
    sub: username,
    iat: moment.unix(),
    admin: admin,
    exp: moment()
      .add(1, "h")
      .unix()
  };
  return jwt.encode(payload, config.token_secret);
}