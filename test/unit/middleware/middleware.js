var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var middleware = require('../../../'+libFolder+'/middleware/middleware');

var sinon = require('sinon');
var assert = require('assert');

describe("endpointMatch()", function () {


	it("create a function", function () {
		var endpointMatch = sinon.stub();
		var chainExecutor = sinon.stub();
		var endpoints = [];
		var badRequest = sinon.stub();
		var notAllowed = sinon.stub();
		var mw = middleware(endpointMatch, chainExecutor, endpoints, badRequest, notAllowed);
		assert.strictEqual(typeof mw, "function");
	});

	describe("when there is no match",function() {
		var endpointMatch = sinon.stub().returns(null);
		var chainExecutor = sinon.stub();
		var endpoints = [];
		var badRequest = sinon.stub();
		var notAllowed = sinon.stub();
		var mw = middleware(endpointMatch, chainExecutor, endpoints, badRequest, notAllowed);
		var req = {};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		describe("call badRequest", function () {
			it("once", function(){
				assert.strictEqual(badRequest.callCount, 1);
			});
			it("with 3 params", function(){
				assert.strictEqual(badRequest.getCall(0).args.length, 3);
			});
			it("with req as first param", function (){
				assert.strictEqual(badRequest.getCall(0).args[0], req);
			});
			it("with res as second param", function () {
				assert.strictEqual(badRequest.getCall(0).args[1], res);
			});
			it("with next as 3th param", function () {
				assert.strictEqual(badRequest.getCall(0).args[2], next);
			});
		});
		it("do not call chainExecutor", function(){
			assert.strictEqual(chainExecutor.callCount,0);
		});
		it("do not call notAllowed", function(){
			assert.strictEqual(notAllowed.callCount,0);
		});
		it("do not call next", function(){
			assert.strictEqual(next.callCount,0);
		});
		it("There is no alowedmethods on res", function(){
			assert.strictEqual(undefined, res.allowedmethods);
		});
	});

	describe("when the match not allows the method",function() {
		var endpointMatch = sinon.stub().returns({
			endpoint: {
				methods:{'GET':1, 'POST':2},
				paramNames:["answer"]
			},
			paramsValue:[42]
		});
		var chainExecutor = sinon.stub();
		var endpoints = [];
		var badRequest = sinon.stub();
		var notAllowed = sinon.stub();
		var mw = middleware(endpointMatch, chainExecutor, endpoints, badRequest, notAllowed);
		endpoint = sinon.stub();
		var req = {
			method: 'NOT_SET',
			params:{}
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("do not call badRequest", function () {
			assert.strictEqual(badRequest.callCount, 0);
		});
		it("do not call chainExecutor", function(){
			assert.strictEqual(chainExecutor.callCount,0);
		});
		it("call notAllowed", function(){
			it("once", function(){
				assert.strictEqual(notAllowed.callCount, 1);
			});
			it("with 3 params", function(){
				assert.strictEqual(notAllowed.getCall(0).args.length, 3);
			});
			it("with req as first param", function (){
				assert.strictEqual(notAllowed.getCall(0).args[0], req);
			});
			it("with res as second param", function () {
				assert.strictEqual(notAllowed.getCall(0).args[1], res);
			});
			it("with next as 3th param", function () {
				assert.strictEqual(notAllowed.getCall(0).args[2], next);
			});
		});
		it("do not call next", function(){
			assert.strictEqual(next.callCount,0);
		});
		it("Add alowedmethods on res", function(){
			assert.deepEqual(res.allowedmethods,["GET","POST"] );
		});
		it("Params are setted", function (){
			assert.deepEqual(req.params, {'answer':42} );
		});
	});

	describe("when the match allows the method",function() {
		var endpointMatch = sinon.stub().returns({
			endpoint: {
				methods:{'GET':'fcts', 'POST':2},
				paramNames:["answer"]
			},
			paramsValue:[42]
		});
		var chain = sinon.stub();
		var chainExecutor = sinon.stub().returns(chain);
		var endpoints = [];
		var badRequest = sinon.stub();
		var notAllowed = sinon.stub();
		var mw = middleware(endpointMatch, chainExecutor, endpoints, badRequest, notAllowed);
		endpoint = sinon.stub();
		var req = {
			method: 'GET',
			params:{}
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("do not call badRequest", function () {
			assert.strictEqual(badRequest.callCount, 0);
		});
		it("call chainExecutor", function(){
			it("once", function(){
				assert.strictEqual(chainExecutor.callCount, 1);
			});
			it("with 3 params", function(){
				assert.strictEqual(chainExecutor.getCall(0).args.length, 3);
			});
			it("with req as first param", function (){
				assert.strictEqual(chainExecutor.getCall(0).args[0], req);
			});
			it("with res as second param", function () {
				assert.strictEqual(chainExecutor.getCall(0).args[1], res);
			});
			it("with next as 3th param", function () {
				assert.strictEqual(chainExecutor.getCall(0).args[2], next);
			});
		});
		it("call the chain", function(){
			it("once", function(){
				assert.strictEqual(chain.callCount, 1);
			});
			it("with 3 params", function(){
				assert.strictEqual(chain.getCall(0).args.length, 3);
			});
			it("with req as first param", function (){
				assert.strictEqual(chain.getCall(0).args[0], req);
			});
			it("with res as second param", function () {
				assert.strictEqual(chain.getCall(0).args[1], res);
			});
			it("with next as 3th param", function () {
				assert.strictEqual(chain.getCall(0).args[2], next);
			});
		});
		it("call notAllowed", function(){
			assert.strictEqual(notAllowed.callCount,0);
		});
		it("do not call next", function(){
			assert.strictEqual(next.callCount,0);
		});
		it("Add alowedmethods on res", function(){
			assert.deepEqual(res.allowedmethods,["GET","POST"] );
		});
		it("Params are setted", function (){
			assert.deepEqual(req.params, {'answer':42} );
		});
	});

});