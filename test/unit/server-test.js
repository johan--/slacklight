import {assert} from 'chai';
import sinon from 'sinon';
import PhotoStore from '../../lib/stores/photo-store.js'
import server from '../../server.js';
import _ from 'lodash'

describe('Server', function() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create()
  })
  afterEach(function() {
    this.sinon.restore()
  })

  describe('#divideIntoTagCategories', function() {
    it('reduces tags into categories', function() {
      this.sinon.stub(PhotoStore, 'getTags').returns(['slackhq', 'rwc'])
      this.sinon.stub(PhotoStore, 'getAll').returns([
        {
          id: 1,
          tags: ['slackhq', 'less', 'busy']
        },
        {
          id: 2,
          tags: ['slackhq', 'sf', 'busy']
        },
        {
          id: 3,
          tags: ['rwc', 'england', 'busy']
        }
      ])


      let target = {
        slackhq: [{
          id: 1,
          tags: ['slackhq', 'less', 'busy']
        },
        {
          id: 2,
          tags: ['slackhq', 'sf', 'busy']
        }],
        rwc: [{
          id: 3,
          tags: ['rwc', 'england', 'busy']
        }]
      }

      let result = server.internals.divideIntoTagCategories()
      assert.deepEqual(result, target)
    })
  })
})
