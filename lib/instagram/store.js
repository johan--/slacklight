var request = require('superagent');
var _ = require('lodash');
var config = require('config');
var async = require('async');
var boom = require('boom');
var moment = require('moment');
var async = require('async');
var InstagramConfig = require('./config');
var Instagram = require('../services/instagram');
var TagsFixtures = require('../../test/fixtures/instagram/tags-fixture')
var PhotoStore = require('../stores/photo-store');

var internals = {
  getRequest: function(endpoint, params, msg, cb) {
    console.log('ENDPOINT', endpoint)
    console.log('PARAMS', params)
    return request.get(endpoint)
            .query(params)
            .end(function(err, res) {
              console.log('ERR, RES', err, res)
              if (err) {
                cb(boom.create(404, msg, err), null)
              } else {
                cb(null, res.body)
              }
            })
  },
  tagsEndpoint: function(tag) {
    return InstagramConfig.get('/media/tags').replace(/#{tag}/, tag);
  }
}

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
  server.method('getInstagramPhotosForTag', function(request, next) {
    var tag = request.query.tag || 'slackhq';
    var endpoint = internals.tagsEndpoint(tag)
    var params = {client_id: config.get('INSTAGRAM_APP_ID')}

    async.waterfall([
      function(callback) {
        return internals.getRequest(endpoint, params, 'Failed to fetch tags', callback)
      },
      function(data, callback) {
        var images = Instagram.parseTags(data);
        PhotoStore.set(images);

        return callback(null, images);
      }
    ], function(err, data) {
      if (err) {
        /*
         * Comment in for fixture api response on rate limit
         * var images = Instagram.parseTags(TagsFixtures);
         * next(null, images)
        **/
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

module.exports.internals = internals;
