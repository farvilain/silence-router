var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var router = require('../../'+libFolder+'/');
var assert = require('assert');
var sinon = require('sinon');

var func1 = sinon.spy();

describe("Creating endpoints", function(){

	it('only GET method on root', function(){
		var r = router().method("GET",func1);
		var endpoints = r.createEndpoints();	
		var expected = [
			{
				regexp : /^\/$/,
				paramNames: [],
				methods : {
					"GET" : { fcts : [func1] }
				}
			}
		];
		assert.deepEqual(Object.keys(endpoints), Object.keys(expected));
		assert.deepEqual(endpoints.regexp, expected.regexp);
		assert.deepEqual(endpoints.paramNames, expected.paramNames);
		assert.deepEqual(endpoints.methods, expected.methods);
		assert.strictEqual(func1.callCount, 0);
	});

	it('only GET method on path', function(){
		var r = router().path("lol").method("GET",func1);
		var endpoints = r.createEndpoints();	
		var expected = [
			{
				regexp : /^\/lol$/,
				paramNames: [],
				methods : {
					"GET" : { fcts : [func1] }
				}
			}
		];
		assert.deepEqual(Object.keys(endpoints), Object.keys(expected));
		assert.deepEqual(endpoints.regexp, expected.regexp);
		assert.deepEqual(endpoints.paramNames, expected.paramNames);
		assert.deepEqual(endpoints.methods, expected.methods);
		assert.strictEqual(func1.callCount, 0);
	});

});