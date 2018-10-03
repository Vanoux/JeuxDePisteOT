let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server.js');
chai.use(chaiHttp);
let assert = require('assert');

describe('blbl()', function () {

	it('exists', function () {
		assert.equal(server('--ezda<>'),'&#151;ezda&lt;&gt;')
	});
	it('should return a space string', function () {
		assert.equal(server(),' ')
	});
});
