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
  getRequest: function(params, msg, endpoint, cb) {
    return request.get(endpoint)
            .query(params)
            .end(function(err, res) {
              // console.log('REQUEST ERROR:', arguments);
              if (err) {
                return cb(err, null)
                // console.log(boom.create(404, msg, err))
              } else {
                // return res.body
                return cb(null, res.body)
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
  server.method('getInstagramPhotosForTags', function(request, next) {
    var tags = PhotoStore.getTags();
    var endpoints = _.map(tags, function(tag) {
      return internals.tagsEndpoint(tag)
    })
    var params = {client_id: config.get('INSTAGRAM_APP_ID')}

    async.waterfall([
      function(callback) {
        var getRequest = _.partial(internals.getRequest, params, 'Failed to fetch tags')

        async.map(endpoints, getRequest, function(err, results) {
            if (err) {
              return callback(boom.create(404, msg, err), null);
            } else {
              return callback(null, results);
            }
        });
      },
      function(data, callback) {
        var images = _.chain(data)
                      .map(function(set) {
                        var images = Instagram.parseTags(set);
                        PhotoStore.set(images);
                        return images;
                      })
                      .flatten()
                      .value()

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
