var assert = require('assert');
var sinon = require('sinon');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var accumulator = require('../../../'+libFolder+'/endpoint/accumulator');

describe("accumulator()",function(){
	describe("with empty method object",function(){
		var endpoint = sinon.spy();
		var pathsToRegexp = sinon.spy();
		var acc = accumulator(endpoint, pathsToRegexp);
		acc({}, [], []);

		describe("pathsToRegexp()", function(){
			it("is not called", function(){
				assert.strictEqual(pathsToRegexp.callCount, 0);
			});
		});
		describe("endpoint()", function(){
			it("is not called", function(){
				assert.strictEqual(endpoint.callCount, 0);
			});
		});
		describe("Result",function(){
			it("is array",function(){
				assert(Array.isArray(acc.result));
			});
			it("is empty",function(){
				assert.strictEqual(acc.result.length,0);
			});
		});
	});

	describe("with single key method object",function(){
		var endpoint = sinon.stub().returns({
			methods : {}
		});
		var pathsToRegexp = sinon.stub().returns({
			regexp : /a/,
			paramNames : ["param"]
		});
		var acc = accumulator(endpoint, pathsToRegexp);
		acc({"GET":{fcts:["fct"]}}, ["path"], ["use"]);
		describe("endpoint()", function(){
			it("is called once", function(){
				assert.strictEqual(endpoint.callCount, 1);
			});
			it("with two params", function(){
				assert.strictEqual(endpoint.getCall(0).args.length, 2);
			});
			it("first is regexp", function(){
				assert.deepEqual(endpoint.getCall(0).args[0], /a/);
			});
			it("Second is paramNames", function(){
				assert.deepEqual(endpoint.getCall(0).args[1], ["param"]);
			});
		});
		describe("pathsToRegexp()",function(){
			it("is called once", function(){
				assert.strictEqual(pathsToRegexp.callCount,1);
			});
			it("with good pathList",function(){
				assert.deepEqual(pathsToRegexp.getCall(0).args[0], ["path"]);
			});
		});
		describe("result", function(){
			it("is array",function(){
				assert(Array.isArray(acc.result));
			});
			it("size = 1", function(){
				assert.strictEqual(acc.result.length, 1);
			});
			describe("first item",function(){
				it("has one method", function(){
					assert.strictEqual(Object.keys(acc.result[0].methods).length, 1);
				});
				it("method is GET", function(){
					assert(acc.result[0].methods.GET.fcts);
				});
				it("method GET has fcts", function(){
					assert.deepEqual(acc.result[0].methods.GET.fcts,["use","fct"]);
				});
			});
		});
	});

	describe("with two keys method object",function(){
		var endpoint = sinon.stub().returns({
			methods : {}
		});
		var pathsToRegexp = sinon.stub().returns({
			regexp : /a/,
			paramNames : ["param"]
		});
		var acc = accumulator(endpoint, pathsToRegexp);
		acc({"GET":{fcts:["getFct"]}, "POST": {fcts:["postFct"]}}, ["path"], ["use"]);

		describe("endpoint()", function(){
			it("is called once", function(){
				assert.strictEqual(endpoint.callCount, 1);
			});
			it("with two params", function(){
				assert.strictEqual(endpoint.getCall(0).args.length, 2);
			});
			it("first is regexp", function(){
				assert.deepEqual(endpoint.getCall(0).args[0], /a/);
			});
			it("Second is paramNames", function(){
				assert.deepEqual(endpoint.getCall(0).args[1], ["param"]);
			});
		});
		describe("PathsToRegexp", function(){
			it("is called once", function(){
				assert.strictEqual(pathsToRegexp.callCount,1);
			});
			it("with good pathList",function(){
				assert.deepEqual(pathsToRegexp.getCall(0).args[0], ["path"]);
			});
		});
		describe("result", function(){
			it("is array",function(){
				assert(Array.isArray(acc.result));
			});
			it("size = 1", function(){
				assert.strictEqual(acc.result.length, 1);
			});
			describe("first item",function(){
				it("has two method", function(){
					assert.strictEqual(Object.keys(acc.result[0].methods).length, 2);
				});
				it("method is GET", function(){
					assert(acc.result[0].methods.GET);
				});
				it("method GET has fcts", function(){
					assert.deepEqual(acc.result[0].methods.GET.fcts,["use","getFct"]);
				});
				it("method is POST", function(){
					assert(acc.result[0].methods.POST);
				});
				it("method POST has fcts", function(){
					assert.deepEqual(acc.result[0].methods.POST.fcts,["use","postFct"]);
				});
			});
		});
	});
});