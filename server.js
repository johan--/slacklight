var _ = require('lodash');
var Hapi = require('hapi');
var server = new Hapi.Server();
var path = require('path');
var config = require('config');
var Basic = require('hapi-auth-basic');
var PhotoStore = require('./lib/stores/photo-store');

var users = {
  slacklight: {
    username: 'slacklight',
    password: 'belessbusy',
    name: 'slacklight'
  }
};

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 5300
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
  },
  require('./lib/instagram')
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
  },
  divideIntoTagCategories: function() {
    var tags = PhotoStore.getTags();
    var photos = PhotoStore.getAll();

    return _.reduce(tags, function(memo, val) {
      var photosForTag = _.chain(photos)
                          .map(function(photo) {
                            if (_.contains(photo.tags, val)) {
                              return photo
                            }
                          })
                          .compact()
                          .value()

      memo[val] = _.chunk(photosForTag, 3)

      return memo
    },{})
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
// internals.authRoute(),
  server.route([
    {
      method: 'GET',
      path: '/',
      config: {
        tags: ['slacklight'],
        description: "Root of slacklight",
        pre: [
          {
            method: 'getInstagramPhotosForTags',
            assign: 'photos'
          }
        ]
      },
      handler: function(request, reply) {
        var photoRows = _.chunk(request.pre.photos, 3);
        var photoCategories = internals.divideIntoTagCategories();
        console.log('CATGEORIES: ', photoCategories);
        reply.view('slacklight.html', {
          allPhotos: PhotoStore.getAll(),
          photoRows: photoRows,
          photoCategories: photoCategories
        })
      }
    },
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
