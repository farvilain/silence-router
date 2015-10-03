var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var endpoint = require('../../'+libFolder+'/endpoint/');

describe("", function(){
	var empty = {
		path : null,
		uses : [],
		childs : [],
		methods : {}
	};

	var result = endpoint(empty);

	it("", function(){
		assert.ok(result);
		assert.ok(Array.isArray(result));
	});
});