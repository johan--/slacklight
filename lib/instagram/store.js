var request = require('superagent');
var _ = require('lodash');
var config = require('config');
var async = require('async');
var boom = require('boom');
var moment = require('moment');
var async = require('async');
var InstagramConfig = require('./config');
var Instagram = require('../services/instagram');

exports.register = function(server, options, next) {
  /*
    @{prop} #{shared} !{scheme}

    @{attribution} - string
    @{tags} - array
    @{location} - geo
    @{comments} - object
      @{count} - integer
      @{data} - array of users
        !{user} - object
    @{filter} - string
    @{created_time} - unix-timestamp
    @{link} - string
    @{likes} - object
      @{count} - object
      @{data} - array of users
        !{user} - object
    @{images} - object
      #{low_resolution} - string
      #{thumbnail} - string
      #{standard_resolution} - string
        !{img} - object
    @{users_in_photo} - array
    @{caption} - object
      @{created_time} - unix-timestamp
      @{text} - string
      @{from} - object
        !{user} - object
      @{id} - string
    @{type} - string
    @{id} - string

    !{img} - img object
      @{url} - string
      @{width} - string
      @{height} - string

    !{user} - user object
      @{username} - string
      @{profile_picture} - string
      @{id} - id
      @{full_name} - string
  **/
  server.method('getInstagramPhotosForTag', function(tag, next) {
    let endpoint = InstagramConfig.get('INSTAGRAM_ROOT').replace(/#{tag}/, targetTag);
    var params = {client_id: config.get('INSTAGRAM_APP_ID')}

    async.waterfall([
      function(callback) {
        return internals.getRequest(endpoint, point, 'Failed to fetch tags', callback)
      },
      function(data, callback) {
        let images = Instagram.parseTags(data);
        callback(null, data)
      }
    ], function(err, data) {
      if (err) {
        next(err, null)
      } else {
        next(null, data)
      }
    })
  })

  next();
};

exports.register.attributes = {
  name: 'instagram-store',
  version: '0.0.1',
  description: 'Instagram server methods'
};

var internals = {
  getRequest: function(endpoint, params, msg, cb) {
    return request.get(endpoint)
            .query(params)
            .end(function(err, res) {
              if (err) {
                cb(boom.create(404, msg, err), null)
              } else {
                console.log('INSTAGRAM DATA: ', res.body.data)
                cb(null, res)
              }
            })
  }
}
module.exports.internals = internals;
