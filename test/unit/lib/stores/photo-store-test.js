import {assert} from 'chai';
import rewire from "rewire";
var PhotoStore = rewire('../../../../lib/stores/photo-store.js');
import TagsFixture from '../../../fixtures/instagram/tags-fixture.json'
import TagFixture from '../../../fixtures/instagram/tag-fixture.json'
import _ from 'lodash'

describe('PhotoStore', function() {
  afterEach(function() {
    PhotoStore.__set__("_photos", [])
  })

  describe('set', function() {
    beforeEach(function() {
      PhotoStore.__set__("_photos", [{id: 1}])
    })

    it('sets only unique photos on the store', function() {
      let input = [{id: 1}, {id: 2}, {id: 3}]
      let result = PhotoStore.set(input)

      assert.deepEqual(result, input)
    })
  })
  describe('get', function() {
    beforeEach(function() {
      PhotoStore.__set__("_photos", [{id: 1}])
    })

    it('returns all the photos in the store', function() {
      let result = PhotoStore.get(1)

      assert.deepEqual(result, {id: 1})
    })
  })
  describe('getAll', function() {
    beforeEach(function() {
      PhotoStore.__set__("_photos", [{id: 1}, {id: 2}])
    })

    it('returns all the photos in the store', function() {
      let result = PhotoStore.getAll()

      assert.deepEqual(result, [{id: 1}, {id: 2}])
    })
  })
})
