exports.register = function(server, options, callback) {
  server.register([
    require('./store')
  ], callback);
}

exports.register.attributes = {
  name: 'instagram-service',
  version: '1.0.0',
  description: 'Server methods for interacting with Instagram'
}
