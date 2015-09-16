var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../../'+libFolder+'/builder/builder.js');
var assertNode = require('../../util/assertNode');

describe("builder", function(){
	describe("getRoot()", function(){
		describe("on only-root tree", function(){
			var root= builder().getRoot();
			it("success", function(){
				assert.ok(root);
			});
			assertNode("root", root, null, 0, [], {});
		});
		describe("with a child path", function(){
			var root= builder().path("account").getRoot();
			it("success", function(){
				assert.ok(root);
			});
			assertNode("root", root, null, 1, [], {});
			assertNode("first child", root.childs[0], "account", 0, [], {});
		});
	});
});
