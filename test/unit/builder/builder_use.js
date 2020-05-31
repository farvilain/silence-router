var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../../'+libFolder+'/builder/builder');
var assertNode = require('../../util/assertNode');

var use1 = function(){};
var use2 = function(){};
var use3 = function(){};

describe("builder", function(){
	describe("use()", function(){
		it("is existing function", function(){
			var b = builder();
			assert.ok(b.use);
			assert.strictEqual(typeof b.use, "function");
		});
		describe("without varargs params", function(){
			it("returns the builder",function(){
				var b = builder();
				assert.strictEqual(b.use(), b);
			});
			describe("Do not change anything", function(){
				var act = builder().use().getAct();
				assertNode("act",act, null, 0, [], {});
			});
		});
		describe("With some varargs params", function(){
			it("returns the builder", function(){
				var b = builder();
				assert.strictEqual(b.use(use1,use2), b);
			});
			describe("Add the uses", function(){
				var act = builder().use(use1,use2).getAct();
				assertNode("act",act, null, 0, [use1,use2], {});
			});
		});
		it("Sequentially is same as all in one",function(){
			var root1 = builder().use(use1).use(use2).use(use3).getRoot();
			var root2 = builder().use(use1,use2,use3).getRoot();
			assert.deepEqual(root1, root2);
		});

		[null, undefined, 1, "lol", [], {} , /abc/].forEach(function(badValue){
			it("refuses first invalid param "+badValue, function() {
				assert.throws(function(){
					builder().use(badValue);
				}, /Expect function param/);
			});
			it("refuses second invalid param "+badValue, function() {
				assert.throws(function(){
					builder().use(use1,badValue);
				}, /Expect function param/);
			});
		});
	});
});
