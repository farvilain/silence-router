var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../../'+libFolder+'/builder/builder.js');

describe("builder", function(){
	describe("getAct()", function(){
		it("is existing function", function(){
			var b = builder();
			assert.ok(b.getAct);
			assert.strictEqual(typeof b.getAct, "function");
		});
		it("on empty is same as getRoot()", function(){
			var b = builder();
			assert.strictEqual(b.getAct(), b.getRoot());
		});
	});
});
