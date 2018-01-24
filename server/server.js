'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var auth0Jwt = require('loopback-auth0-jwt');

var app = (module.exports = loopback());
const {AUTH0_DOMAIN, AUTH0_CLIENT_SECRET, AUTH0_API_AUDIENCE} = process.env;

var authConfig = {
  secretKey: new Buffer(AUTH0_CLIENT_SECRET, 'base64'),
};

var auth = auth0Jwt(app, authConfig);

app.use('/api', (req, res, next) => {
  if (req.path.indexOf('/jobs') > -1 && req.method === 'GET') {
    next();
  } else {
    auth.authenticated[0](req, res, err => {
      if (err) return next(err);
      auth.authenticated[1](req, res, err => {
        return next(err);
      });
    });
  }
});

// optional
app.get('/api/logout', auth.logout);

// catch error
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      message: 'Invalid token, or no token supplied!',
      code: err.name,
      path: req.path,
      method: req.method,
    });
  } else {
    console.log(err);
    res.status(500).send(err);
  }
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) app.start();
});
