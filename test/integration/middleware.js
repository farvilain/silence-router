var assert = require('assert');
var sinon = require('sinon');

var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var middleware = require('../../'+libFolder+'/middleware/');

describe("Middleware", function(){

	describe("creation", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [] }
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);

		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'badRequest'", function (){
			assert.strictEqual(0, badRequest.callCount);
		});
		it("do not call 'notAllowed'", function (){
			assert.strictEqual(0, notAllowed.callCount);
		});
	});

	describe("badRequest", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [] }
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);
		var req = {
			method: 'POST',
			path: "/some/notExisting"
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'next'", function (){
			assert.strictEqual(0, next.callCount);
		});
		describe("call 'badRequest'", function (){
			it("once", function(){
				assert.strictEqual(1, badRequest.callCount);
				assert.strictEqual(badRequest.getCall(0).args.length, 3);
				assert.strictEqual(badRequest.getCall(0).args[0], req);
				assert.strictEqual(badRequest.getCall(0).args[1], res);
				assert.strictEqual(badRequest.getCall(0).args[2], next);
			});
		});
		it("do not call 'notAllowed'", function (){
			assert.strictEqual(0, notAllowed.callCount);
		});
	});

	describe("notAllowed", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [] }
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);
		var req = {
			method: 'POST',
			path: "/some/path"
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'next'", function (){
			assert.strictEqual(0, next.callCount);
		});
		describe("call 'notAllowed'", function (){
			it("once", function(){
				assert.strictEqual(1, notAllowed.callCount);
				assert.strictEqual(notAllowed.getCall(0).args.length, 3);
				assert.strictEqual(notAllowed.getCall(0).args[0], req);
				assert.strictEqual(notAllowed.getCall(0).args[1], res);
				assert.strictEqual(notAllowed.getCall(0).args[2], next);
			});
		});
		it("do not call 'badRequest'", function (){
			assert.strictEqual(0, badRequest.callCount);
		});
	});

	describe("matching", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var getMethod = sinon.spy();
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [getMethod]}
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);
		var req = {
			method: 'GET',
			path: "/some/path"
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'notAllowed'", function (){
			assert.strictEqual(0, notAllowed.callCount);
		});
		it("do not call 'badRequest'", function (){
			assert.strictEqual(0, badRequest.callCount);
		});
		describe("call 'getMethod'", function (){
			it("once", function (){
				assert.strictEqual(1, getMethod.callCount);
			});
			it("with 3 params", function (){
				assert.strictEqual(3, getMethod.getCall(0).args.length);
			});
			it("with first params is req", function (){
				assert.strictEqual(req, getMethod.getCall(0).args[0]);
			});
			it("with second params is res", function (){
				assert.strictEqual(res, getMethod.getCall(0).args[1]);
			});
			it("with 3th params is a function", function (){
				assert.strictEqual(typeof getMethod.getCall(0).args[2], "function");
			});
		});
		it("do not call 'next'", function (){
			assert.strictEqual(0, next.callCount);
		});
	});

describe("notAllowed", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [] }
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);
		var req = {
			method: 'POST',
			path: "/some/path"
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'next'", function (){
			assert.strictEqual(0, next.callCount);
		});
		describe("call 'notAllowed'", function (){
			it("once", function(){
				assert.strictEqual(1, notAllowed.callCount);
				assert.strictEqual(notAllowed.getCall(0).args.length, 3);
				assert.strictEqual(notAllowed.getCall(0).args[0], req);
				assert.strictEqual(notAllowed.getCall(0).args[1], res);
				assert.strictEqual(notAllowed.getCall(0).args[2], next);
			});
		});
		it("do not call 'badRequest'", function (){
			assert.strictEqual(0, badRequest.callCount);
		});
	});

	describe("matching when function call next with error", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var getMethod = function(req, res, next){ next("an error");};
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [getMethod]}
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);
		var req = {
			method: 'GET',
			path: "/some/path"
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'notAllowed'", function (){
			assert.strictEqual(0, notAllowed.callCount);
		});
		it("do not call 'badRequest'", function (){
			assert.strictEqual(0, badRequest.callCount);
		});
		describe("finally call 'next'", function (){
			it("once", function(){
				assert.strictEqual(1, next.callCount);
			});
			it("with one param", function(){
				assert.strictEqual(1, next.getCall(0).args.length);
			});
			it("with first param is the param error", function(){
				assert.strictEqual(next.getCall(0).args[0],"an error" );
			});
		});
	});

	describe("matching when function call next with nothing", function (){
		var badRequest = sinon.spy();
		var notAllowed = sinon.spy();
		var getMethod = function(req, res, next){ next();};
		var endpoints = [{
			regexp : /^\/some\/path/,
			methods : {
				'GET' : { fcts : [getMethod]}
			}
		}];
		var mw = middleware(endpoints, badRequest, notAllowed);
		var req = {
			method: 'GET',
			path: "/some/path"
		};
		var res = {};
		var next = sinon.stub();
		mw(req, res, next);
		it("middleware is a function", function(){
			assert.strictEqual(typeof mw, "function");
		});
		it("middleware has a name", function (){
			assert.strictEqual( mw.name,"silenceMW");
		});
		it("do not call 'notAllowed'", function (){
			assert.strictEqual(0, notAllowed.callCount);
		});
		it("do not call 'badRequest'", function (){
			assert.strictEqual(0, badRequest.callCount);
		});
		describe("finally call 'next'", function (){
			it("once", function(){
				assert.strictEqual(1, next.callCount);
			});
			it("with no param", function(){
				assert.strictEqual(0, next.getCall(0).args.length);
			});
		});
	});
});