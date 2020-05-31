var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../../'+libFolder+'/builder/builder.js');

describe("builder", function(){
	describe("parent()", function(){
		it("is existing function", function(){
			var b = builder();
			assert.ok(b.parent);
			assert.strictEqual(typeof b.parent, "function");
		});
		it("on empty returns the builder", function(){
			var b = builder();
			var b2 = b.parent();
			assert.strictEqual(b,b2);
		});
		it("with a single path, set actual to root", function(){
			var b = builder();
			var act = b.path("child").parent();
			assert.strictEqual(act,b);
		});
	});
});
