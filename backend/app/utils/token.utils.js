const jwt = require('jsonwebtoken');
var createToken = function(auth) {
    return jwt.sign({
            id: auth.id
        }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
  generateToken: function(req, res, next) {
      req.token = createToken(req.auth);
      return next();
  },
  sendToken: function(req, res) {
    var data = {
        'token': req.token,
        'email': req.user.email
    }

    res.setHeader('x-auth-token', JSON.stringify(data));
    return res.status(200).send(JSON.stringify(req.user));
  }
};
