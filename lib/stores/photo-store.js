var _ = require('lodash');

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
  }
}
