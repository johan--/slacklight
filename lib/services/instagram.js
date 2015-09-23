var _ = require('lodash');
var TAG_ATTRS = [
  'created_time',
  'tags',
  'likes',
  'images',
  'caption',
  'user',
]
var moment = require('moment')

module.exports = {
  parseTags: function(input) {
    return _.map(input.data, function(tag) {
      return this.parseTag(tag)
    }, this)
  },
  parseTag: function(tag) {
    let grossAttrs = internals.grossAttrs(tag)
    return _.reduce(grossAttrs, function(memo, val, key) {
      memo[key] = internals[key](val);

      return memo
    }, {})
  }
}

var internals = {
  grossAttrs: function(tag) {
    return _.pick(tag, TAG_ATTRS)
  },
  created_time: function(time) {
    return moment(parseFloat(time)*1000).format('LLL')
  },
  tags: function(input) {
    return input
  },
  likes: function(input) {
    var pictures = _.map(input.data, function(user) { return user.profile_picture })

    return {
      count: input.count,
      profile_pictures: pictures
    }
  },
  images: function(input) {
    return _.get(input, 'standard_resolution.url');
  },
  caption: function(input) {
    return input.text
  },
  user: function(input) {
    return _.pick(input, ['username', 'profile_picture'])
  }
}
module.exports.internals = internals;
