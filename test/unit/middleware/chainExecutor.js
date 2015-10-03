var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var chainExecutor = require('../../../'+libFolder+'/middleware/chainExecutor');
var assert = require('assert');
var sinon = require('sinon');


describe("chainExecutor()", function () {
	describe("with empty fcts", function(){
		describe("not receiving error", function(){
			var req = {};
			var res = {};
			var final = sinon.spy();
			var executor = chainExecutor([], req, res, final);
			executor();
			describe("call final", function(){
				it("once",function(){
					assert.strictEqual(final.callCount, 1);
				});
				it("with no argument", function(){
					assert.strictEqual(final.getCall(0).args.length, 0);
				});
			});
		});
		describe("receiving error", function(){
			var req = {};
			var res = {};
			var final = sinon.spy();
			var executor = chainExecutor([], req, res, final);
			var error = {};
			executor(error);
			describe("call final", function(){
				it("once",function(){
					assert.strictEqual(final.callCount, 1);
				});
				it("with one argument", function(){
					assert.strictEqual(final.getCall(0).args.length, 1);
				});
				it("first argument is the error", function(){
					assert.strictEqual(final.getCall(0).args[0], error);
				});
			});
		});
	});

	describe("with many fcts", function(){
		describe("not receiving error", function(){
			var req = {};
			var res = {};
			var final = sinon.spy();
			var f1 = sinon.spy();
			var othersf = [sinon.spy(),sinon.spy(),sinon.spy(),sinon.spy()];
			var executor = chainExecutor([f1].concat(othersf), req, res, final);
			executor();
			describe("call first function", function(){
				it("once", function(){
					assert.strictEqual(f1.callCount, 1);});
				it("with 3 params", function(){
					assert.strictEqual(f1.getCall(0).args.length, 3);
				});
				it("first is req", function(){
					assert.strictEqual(f1.getCall(0).args[0], req);
				});
				it("second is res", function(){
					assert.strictEqual(f1.getCall(0).args[1], res);
				});
				it("third is executor itself", function(){
					assert.strictEqual(f1.getCall(0).args[2], executor);
				});
			});
			it("do not any others functions", function(){
				othersf.forEach(function(f){
					assert.strictEqual(f.callCount, 0);
				});
			});
			it("do not call final", function(){
				assert.strictEqual(final.callCount, 0);
			});
		});
		describe("receiving error", function(){
			var req = {};
			var res = {};
			var final = sinon.spy();
			var f1 = sinon.spy();
			var othersf = [sinon.spy(),sinon.spy(),sinon.spy(),sinon.spy()];
			var executor = chainExecutor([f1].concat(othersf), req, res, final);
			var error = {};
			executor(error);
			it("do not any function", function(){
				assert.strictEqual(f1.callCount, 0);
				othersf.forEach(function(f){
					assert.strictEqual(f.callCount, 0);
				});
			});
			describe("call final", function(){
				it("once",function(){
					assert.strictEqual(final.callCount, 1);
				});
				it("with one argument", function(){
					assert.strictEqual(final.getCall(0).args.length, 1);
				});
				it("first argument is the error", function(){
					assert.strictEqual(final.getCall(0).args[0], error);
				});
			});
		});
	});
});

module.exports = chainExecutor;