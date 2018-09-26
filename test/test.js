let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const test = require('../server.js');
chai.use(chaiHttp);

let assert = require('assert');
  describe('#Test()', function() {
    it('test', function() {
      assert.equal(test,'test');
    });
  });
