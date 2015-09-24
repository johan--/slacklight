var _ = require('lodash');

var _photos = [];
module.exports = {
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
