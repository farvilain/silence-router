var sinon = require('sinon');
var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var nodeVisitor = require('../../../'+libFolder+'/endpoint/nodeVisitor');

function assertRecCall(args, rec, node, uses, path){
	it("rec function", function(){
		assert.strictEqual(args[0], rec);
	});
	it("node", function(){
		assert.strictEqual(args[1], node);
	});
	it("uses", function(){
		assert.deepEqual(args[2], uses);
	});
	it("pathList", function(){
		assert.deepEqual(args[3], path);
	});
}

describe("nodeVisitor()", function(){
	describe("for main without child",function(){
		describe("nor uses", function(){
			var rec = sinon.spy();
			var acc = sinon.spy();
			var main = { path:'main', uses : [], childs : [], methods:"methodObject" };
			nodeVisitor(rec, acc, main, ["use"],["path"]);

			describe(", accumulator() is called",function(){
				it("once", function(){
					assert(acc.calledOnce);
				});
				it("with main.methods", function(){
					assert.strictEqual(acc.getCall(0).args[0], "methodObject");
				});
				it("with initial path list + node path", function(){
					assert.deepEqual(acc.getCall(0).args[1], ["path","main"]);
				});
				it("with initial use values", function(){
					assert.deepEqual(acc.getCall(0).args[2],  ["use"]);
				});
			});
			describe(", recCall()",function(){
				it(" is not call", function(){
					assert.strictEqual(rec.callCount,0);
				});
			});
		});
		describe("but some uses", function(){
			var rec = sinon.spy();
			var acc = sinon.spy();
			var main = { path:'main', uses : ["mainUse"], childs : [], methods:"methodObject" };
			nodeVisitor(rec, acc, main, ["use"],["path"]);
			
			describe(", accumulator() is called",function(){
				it("once", function(){
					assert(acc.calledOnce);
				});
				it("with main.methods", function(){
					assert.strictEqual(acc.getCall(0).args[0], "methodObject");
				});
				it("with initial path list + node path", function(){
					assert.deepEqual(acc.getCall(0).args[1], ["path","main"]);
				});
				it("with initial use values + node.uses", function(){
					assert.deepEqual(acc.getCall(0).args[2],  ["use","mainUse"]);
				});
			});
			describe(", recCall()",function(){
				it(" is not call", function(){
					assert.strictEqual(rec.callCount,0);
				});
			});
		});
	});
	describe("for main having two childs", function(){
		describe("but no uses", function(){
			var rec = sinon.spy();
			var acc = sinon.spy();
			var main = { path:'main', uses : [], childs : ["child1","child2"], methods:"methodObject" };
			nodeVisitor(rec, acc, main, ["use"],["path"]);

			describe(", accumulator() is called",function(){
				it("once", function(){
					assert(acc.calledOnce);
				});
				it("with main.methods", function(){
					assert.strictEqual(acc.getCall(0).args[0], "methodObject");
				});
				it("with initial path list + node path", function(){
					assert.deepEqual(acc.getCall(0).args[1], ["path","main"]);
				});
				it("with initial use values + node.uses", function(){
					assert.deepEqual(acc.getCall(0).args[2],  ["use"]);
				});
			});
			describe(", recCall()",function(){
				it(" is call twice", function(){
					assert.strictEqual(rec.callCount,2);
				});
				describe("is first called with",function(){
					assertRecCall(rec.getCall(0).args, rec, acc, "child1", ["use"],["path","main"]);
				});
				describe("is secondly called with",function(){
					assertRecCall(rec.getCall(1).args, rec,acc, "child2", ["use"],["path","main"]);
				});
			});
		});
		describe("and some uses", function(){
			var rec = sinon.spy();
			var acc = sinon.spy();
			var main = { path:'main', uses : ["mainUse"], childs : ["child1","child2"], methods:"methodObject" };
			nodeVisitor(rec, acc, main, ["use"],["path"]);

			describe(", accumulator() is called",function(){
				it("once", function(){
					assert(acc.calledOnce);
				});
				it("with main.methods", function(){
					assert.strictEqual(acc.getCall(0).args[0], "methodObject");
				});
				it("with initial path list + node path", function(){
					assert.deepEqual(acc.getCall(0).args[1], ["path","main"]);
				});
				it("with initial use values + node.uses", function(){
					assert.deepEqual(acc.getCall(0).args[2],  ["use","mainUse"]);
				});
			});
			describe(", recCall()",function(){
				it("is call twice", function(){
					assert.strictEqual(rec.callCount,2);
				});
				describe("is first called with",function(){
					assertRecCall(rec.getCall(0).args, rec, acc,  "child1", ["use","mainUse"], ["path","main"]);
				});
				describe("is secondly called with",function(){
					assertRecCall(rec.getCall(1).args, rec, acc, "child2", ["use","mainUse"], ["path","main"]);
				});
			});
		});
	});
});
