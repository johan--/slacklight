import {assert} from 'chai';
import InstagramStore from '../../../../lib/instagram/store.js';
import _ from 'lodash'

describe('InstagramStore', function() {
  describe('#internals', function() {
    it('returns the tags route for the target tag', function() {
      let result = InstagramStore.internals.tagsEndpoint('slackhq');
      let target = 'https://api.instagram.com/v1/tags/slackhq/media/recent';
      assert.equal(result, target, "endpoint for tag");
    })
  })
})
