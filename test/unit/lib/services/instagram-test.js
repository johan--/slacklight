import {assert} from 'chai';
import rewire from "rewire";
let Instagram = rewire('../../../../lib/services/instagram.js');
import TagsFixture from '../../../fixtures/instagram/tags-fixture.json'
import TagFixture from '../../../fixtures/instagram/tag-fixture.json'
import _ from 'lodash'

// Control the timezone
let moment = require('moment-timezone');
moment.tz.setDefault("UTC");
Instagram.__set__('moment', moment);

describe('Instagram', function() {
  describe('parseTags', function() {
    it('parses data payload to required photo scheme', function() {
      var target = [{
        id: "1076473596329212724_17039749",
        caption: "caption title",
        created_time: "Sep 18th 2015",
        images: "https://standard_resolution.jpg",
        likes: {
          count: 2,
          profile_pictures: [
            "https://emil_nygaard.jpg",
            "https://shane_rogers.jpg"
          ]
        },
        tags: ['slackhq'],
        user: {
          profile_picture: "https://deanihansen.jpg",
          username: "deanihansen"
        }
      }]

      var input = {
        data: [TagFixture]
      }

      var result = Instagram.parseTags(input);

      assert.deepEqual(result, target);
    })
  })
  describe('#internals', function() {
    describe('#grossAttrs', function() {
      it('extracts only the target attrs', function() {
        var target = {
          'id': 'id',
          'created_time': 'created_time',
          'tags': 'tags',
          'likes': 'likes',
          'images': 'images',
          'caption': 'caption',
          'user': 'user'
        }
        var input = _.assign(_.cloneDeep(target), {'remove': 'remove'});

        var result = Instagram.internals.grossAttrs(input)
        assert.deepEqual(result, target)
      })
    })
    describe('#id', function() {
      it('returns the tag id', function() {
        var result = Instagram.internals.id(TagFixture.id)
        var target = "1076473596329212724_17039749";
        assert.equal(result, target)
      })
    })
    describe('#created_time', function() {
      it('converts unix time to formatted time', function() {
        var input = "1442545674"
        var result = Instagram.internals.created_time(input)
        var target = "Sep 18th 2015";
        assert.equal(result, target)
      })
    })
    describe('#tags', function() {
      it('extracts the tags', function() {
        var input = ['slack', 'sass'];
        var result = Instagram.internals.tags(input)
        assert.sameMembers(result, input)
      })
    })
    describe('#likes', function() {
      it('extracts the likes', function() {
        var target = {
          count: 2,
          profile_pictures: [
            "https://emil_nygaard.jpg",
            "https://shane_rogers.jpg"
          ]
        }
        var result = Instagram.internals.likes(TagFixture.likes)
        assert.deepEqual(result, target)
      })
    })
    describe('#images', function() {
      it('extracts the standard_resolution image', function() {
        var target = "https://standard_resolution.jpg";
        var result = Instagram.internals.images(TagFixture['images'])
        assert.equal(result, target)
      })
    })
    describe('#caption', function() {
      it('extracts the caption', function() {
        var target = "caption title";
        var result = Instagram.internals.caption(TagFixture['caption'])
        assert.equal(result, target)
      })
    })
    describe('#user', function() {
      it('extracts the user', function() {
        var target = {
          "username": "deanihansen",
          "profile_picture": "https://deanihansen.jpg"
        };
        var result = Instagram.internals.user(TagFixture['user'])
        assert.deepEqual(result, target)
      })
    })
  })
})
