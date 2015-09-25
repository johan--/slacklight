import {assert} from 'chai';
import Slacklight from '../../../app/slacklight.js';
import _ from 'lodash'

describe('Slacklight', function() {
  describe('#indexPair', function() {
    it('returns next & prev index pair', function() {
      let collection = ['a','b','c'];
      let target = {
        prev: 0,
        next: 2
      }

      let result = Slacklight.indexPairs(collection, 1)
      assert.deepEqual(result, target)
    })
    it('at low extreme: returns next & prev index pair', function() {
      let collection = ['a','b','c'];
      let target = {
        prev: 2,
        next: 1
      }

      let result = Slacklight.indexPairs(collection, 0)
      assert.deepEqual(result, target)
    })
    it('at high extreme: returns next & prev index pair', function() {
      let collection = ['a','b','c'];
      let target = {
        prev: 1,
        next: 0
      }

      let result = Slacklight.indexPairs(collection, 2)
      assert.deepEqual(result, target)
    })
  })
})
