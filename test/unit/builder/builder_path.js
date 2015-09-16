var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../../'+libFolder+'/builder/builder.js');
var assertNode = require('../../util/assertNode');

var use1 = function(){};
var use2 = function(){};
var use3 = function(){};

describe("builder", function(){
	describe("path()", function(){
		it("is existing function", function(){
			var b = builder();
			assert.ok(b.path);
			assert.strictEqual(typeof b.path, "function");
		});
		describe("without any uses", function(){
			it("returns the builder", function(){
				var b = builder();
				var b2 = b.path("account");
				assert.strictEqual(b,b2);
			});
			describe("set the act to newly created", function(){
				var b = builder().path("account");
				assertNode("act",b.getAct(), "account", 0, [], {});
			});
		
			[null, undefined, 1, function(){}, [], {} , /abc/].forEach(function(badValue){
				it("refuses param "+badValue, function() {
					assert.throws(function(){
						builder().path(badValue);
					}, /Expect string param/);
				});
			});
			describe("chaining", function(){
				var b = builder().path("a").path("b");
				describe("create the right structure", function(){
					var root = b.getRoot();
					assertNode("root",root, null, 1, [], {});
					assertNode("first child",root.childs[0], "a", 1, [], {});
					assertNode("first sub child",root.childs[0].childs[0], "b", 0,  [], {});
				});
				describe("set the act to latest created", function(){
					assertNode("act",b.getAct(), "b", 0, [], {});
				});
			});
			describe("if path already exists", function(){
				var b = builder().path("a").parent().path("a");
				describe("Do not recreate the path", function(){
					var root = b.getRoot();
					assertNode("root",root, null, 1, [], {});
					assertNode("first child",root.childs[0], "a", 0, [], {});
				});
				describe("set the act to not-really-created", function(){
					assertNode("act",b.getAct(), "a", 0, [], {});
				});
			});
		});

		describe("with some uses", function(){
			it("returns the builder", function(){
				var b = builder();
				var b2 = b.path("account", use1,use2,use3);
				assert.strictEqual(b,b2);
			});
			describe("set the act to newly created", function(){
				var b = builder().path("account",use1,use2,use3);
				assertNode("act", b.getAct(), "account", 0, [use1,use2,use3], {});
			});
		
			[null, undefined, 1, function(){}, [], {} , /abc/].forEach(function(badValue){
				it("refuses param "+badValue, function() {
					assert.throws(function(){
						builder().path(badValue, use1,use2,use3);
					}, /Expect string param/);
				});
			});
			describe("chaining", function(){
				var b = builder().path("a",use1).path("b",use2);
				describe("create the right structure", function(){
					var root = b.getRoot();
					assertNode("root",root, null, 1, [], {});
					assertNode("first child", root.childs[0], "a", 1, [use1], {});
					assertNode("first sub child", root.childs[0].childs[0], "b", 0, [use2], {});
				});
				describe("set the act to latest created", function(){
					assertNode("act", b.getAct(), "b", 0, [use2], {});
				});
			});
			describe("if path already exists", function(){
				it("throws an error", function(){
					var b = builder().path("account").parent();
					assert.throws(function(){
						b.path("account", use1,use2,use3);
					}, /Path account already exists but you give me some use fcts/);
				});
			});
		});
	});
});
