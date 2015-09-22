var _ = require('lodash');
var Hapi = require('hapi');
var server = new Hapi.Server();
var path = require('path');
var config = require('config');
var Basic = require('hapi-auth-basic');

var users = {
  slacklight: {
    username: 'slacklight',
    password: 'belessbusy',
    name: 'slacklight'
  }
};

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3900
});

server.views({
  engines: {
    html: require('swig')
  },
  path: path.join(__dirname, 'views'),
  isCached: process.env.NODE_ENV === 'production',
  compileOptions: {
    isPretty: true
  }
});

if (process.env.NODE_ENV === 'production') {
  // Prevent Sleeping Dynos
  setInterval(function() {
      http.get("http://slacklight.herokuapp.com");
  }, 60000); // every minute
}

var plugins = [
  {
    register: require('good'),
    options: {
      opsInterval: 1000,
      reporters: [
        {
          reporter: require('good-console'),
          args: [{ log: '*', response: '*', error: '*' }]
        }
      ]
    }
  }
]

var internals = {
  isProd: function() {
    return process.env.NODE_ENV !== 'production';
  },
  authRoute: function(route) {
    if (internals.isProd()) {
      _.assign(route.config, { auth: 'simple' })
    }

    return route;
  }
}

if (internals.isProd()) {
  plugins = plugins.concat(Basic);
}

server.register(plugins
  , function(err) {
  if (err) {
    throw err;
  }

  server.route([
     internals.authRoute({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply.view('layout.html')
      }
    }),
    {
        method: 'GET',
        path: '/{p*}',
        handler: {
          directory: {
            path: 'public'
          }
        }
      }
  ]);

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  })
})

module.exports.server = server;
module.exports.internals = internals;
