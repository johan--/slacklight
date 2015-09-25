var _ = require('lodash');

var _tagCategories = ['slackhq', 'rwc2015'];
var _photos = [];
module.exports = {
  get: function(id) {
    return _.find(_photos, {id: id})
  },
  getAll: function () {
    return _photos
  },
  set: function (photos) {
    var existingPhotos = _.cloneDeep(_photos);
    var merged = _.union(_photos, photos)
    _photos = _.uniq(merged, 'id');
    return _photos
  },
  getTags: function() {
    return _tagCategories;
  }
}
