var Confidence = require('confidence');

var InstagramEndpoints = {
  root: 'https://api.instagram.com',
  media: {
    tags: 'https://api.instagram.com/v1/tags/#{tag}/media/recent',
  }
}

var store = new Confidence.Store(InstagramEndpoints);

module.exports = store;
