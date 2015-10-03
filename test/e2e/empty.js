var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../'+libFolder+'/');

var assert = require('assert');
var sinon = require('sinon');

describe("Empty builder", function(){
	['GET','POST','PUT','DELETE'].forEach(function(meth){
		['/','/something/1', '/very/long/path/for/empty/builder'].forEach(function(path){
			it("with "+meth+" on '"+path+"' results in badRequest", function (){
				var req = {
					path : path,
					method: meth
				};
				var res = {};

				var others = sinon.spy();
				var badRequest = sinon.spy();
				var notAllowed = sinon.spy();
				var final = sinon.spy();
				var mw = builder().use(others).use(others,others).createMW(badRequest, notAllowed);
				mw(req, res, final);


				assert.strictEqual(0, others.callCount);
				assert.strictEqual(0, notAllowed.callCount);
				assert.strictEqual(0, final.callCount);
				assert.strictEqual(1, badRequest.callCount);

				assert.strictEqual(3, badRequest.getCall(0).args.length);

				assert.strictEqual(req, badRequest.getCall(0).args[0]);
				assert.deepEqual({ path:path,method: meth}, req);

				assert.strictEqual(res, badRequest.getCall(0).args[1]);
				assert.deepEqual({}, res);
				assert.strictEqual(final, badRequest.getCall(0).args[2]);
			});
		});
	});
});

describe("If method do not exists", function(){
	['GET','POST','PUT','DELETE'].forEach(function(meth){
		it("with "+meth+" on / results in 'methodNotAllowed'", function (){
			var req = {
				path:"/",
				method: meth
			};
			var res = {};

			var badRequest = sinon.spy();
			var notAllowed = sinon.spy();
			var final = sinon.spy();
			var others = sinon.spy();
			var mw = builder().use(others).use(others,others).method('HEAD', others, others).createMW(badRequest, notAllowed);
			mw(req, res, final);

			assert.strictEqual(0, others.callCount);
			assert.strictEqual(0, badRequest.callCount);
			assert.strictEqual(0, final.callCount);
			assert.strictEqual(1, notAllowed.callCount);

			assert.strictEqual(3, notAllowed.getCall(0).args.length);

			assert.strictEqual(req, notAllowed.getCall(0).args[0]);
			assert.deepEqual({ path:"/",method: meth}, req);
			assert.strictEqual(res, notAllowed.getCall(0).args[1]);
			assert.deepEqual({ allowedmethods:['HEAD']}, res);
			assert.strictEqual(final, notAllowed.getCall(0).args[2]);
		});
	});
});
