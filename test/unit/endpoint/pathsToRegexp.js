var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var pathsToRegexp = require('../../../'+libFolder+'/endpoint/pathsToRegexp');
var assert = require('assert');
var sinon = require('sinon');

describe('pathsToRegexp()',function(){

	["1",1, {}, function(){}, null, undefined].forEach(function(badValue){
		it("Refuse non-array value:"+badValue, function(){
			var regexpAndParams = sinon.stub();
			assert.throws(function(){pathsToRegexp(regexpAndParams,badValue);}, /expects a non empty array/);
		});
	}),

	it("Refuse empty array value", function(){
		var regexpAndParams = sinon.stub();
		assert.throws(function(){pathsToRegexp(regexpAndParams,[]);}, /expects a non empty array/);
	});
	describe("With 1-size array", function(){
		var regexpAndParamsResult = {};
		var regexpAndParams = sinon.stub();
		regexpAndParams.returns(regexpAndParamsResult);
		var result = pathsToRegexp(regexpAndParams,[""]);
		describe("calls regexpAndParams", function(){
			it("once", function(){
				assert.strictEqual(regexpAndParams.callCount,1);
			});
			it("with two params", function(){
				assert.strictEqual(regexpAndParams.getCall(0).args.length,2);
			});
			it("with first params is the good regexp", function(){
				assert.deepEqual(regexpAndParams.getCall(0).args[0],/^\/$/);
			});
			it("without paramNames", function(){
				assert.deepEqual(regexpAndParams.getCall(0).args[1],[]);
			});
		});
		it("returns the regexpAndParams result", function(){
			assert.strictEqual(regexpAndParamsResult,result);
		});
	});

	describe("With 2 simple string array", function(){
		var regexpAndParamsResult = {};
		var regexpAndParams = sinon.stub();
		regexpAndParams.returns(regexpAndParamsResult);
		var result = pathsToRegexp(regexpAndParams,["a","b"]);
		describe("calls regexpAndParams", function(){
			it("once", function(){
				assert.strictEqual(regexpAndParams.callCount,1);
			});
			it("with two params", function(){
				assert.strictEqual(regexpAndParams.getCall(0).args.length,2);
			});
			it("with first params is the good regexp", function(){
				assert.deepEqual(regexpAndParams.getCall(0).args[0], /^\/b$/);
			});
			it("without paramNames", function(){
				assert.deepEqual(regexpAndParams.getCall(0).args[1],[]);
			});
		});
		it("returns the regexpAndParams result", function(){
			assert.strictEqual(regexpAndParamsResult,result);
		});
	});
	describe("with 2size array having second is regexp path", function(){
		var regexpAndParamsResult = {};
		var regexpAndParams = sinon.stub();
		regexpAndParams.returns(regexpAndParamsResult);
		var result = pathsToRegexp(regexpAndParams,[":id",":name"]);
		describe("calls regexpAndParams", function(){
			it("once", function(){
				assert.strictEqual(regexpAndParams.callCount,1);
			});
			it("with two params", function(){
				assert.strictEqual(regexpAndParams.getCall(0).args.length,2);
			});
			it("with first params is the good regexp", function(){
				assert.deepEqual(regexpAndParams.getCall(0).args[0], /^\/([^\/]*)$/);
			});
			it("with 'name' paranNames", function(){
				assert.deepEqual(regexpAndParams.getCall(0).args[1],['name']);
			});
		});
		it("returns the regexpAndParams result", function(){
			assert.strictEqual(regexpAndParamsResult,result);
		});
	});
	['-','/','\\','^','$','*','+','?','.','(',')','|','[',']','{','}'].forEach(function(specialChar) {
		describe("with "+specialChar+' in simple string path', function(){
			var regexpAndParamsResult = {};
			var regexpAndParams = sinon.stub();
			regexpAndParams.returns(regexpAndParamsResult);
			var result = pathsToRegexp(regexpAndParams,[null,specialChar]);
			describe("calls regexpAndParams", function(){
				it("once", function(){
					assert.strictEqual(regexpAndParams.callCount,1);
				});
				it("with two params", function(){
					assert.strictEqual(regexpAndParams.getCall(0).args.length,2);
				});
				it("with first params is the good regexp", function(){
					assert.deepEqual(regexpAndParams.getCall(0).args[0].toString(), "/^\\/\\"+specialChar+"$/");
				});
				it("with the no paranNames", function(){
					assert.deepEqual(regexpAndParams.getCall(0).args[1],[]);
				});
			});
			it("returns the regexpAndParams result", function(){
				assert.strictEqual(regexpAndParamsResult,result);
			});
		});
	});
});