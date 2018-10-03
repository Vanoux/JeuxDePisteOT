let chai = require('chai');
let expect = chai.expect;
let should = chai.should();
let server = require('../server.js');
let assert = require('assert');

describe('blbl()', function () {

	it('should return the html code of --', function () {
		assert.equal(server.blbl('--'),'&#151;')
	});
	it('should return a space string', function () {
		assert.equal(server.blbl(),' ')
	});
	it('should return the html code of <',function(){
		assert.equal(server.blbl('<'),'&lt;')
	});
	it('should return the html code of >',function(){
		assert.equal(server.blbl('>'),'&gt;')
	});
	it('should return the html code of "',function(){
		assert.equal(server.blbl('"'),'&quot;')
	});
	it('should return the html code of \'',function(){
		assert.equal(server.blbl("'"),'&#039;')
	});
	it('should return the html code of &',function(){
		assert.equal(server.blbl('&'),'&amp;')
	});
});

server.bcrypt.hash('test',null,null,function(err,hash){
	describe('Bcrypt hash',function(){
		it('should return a different password',function(){
			assert.notEqual(hash,'test')
		});
		it('should return true when compare the test string with the hash password',function(){
			assert.equal(server.bcrypt.compareSync('test',hash),true)
		})
	})
});

