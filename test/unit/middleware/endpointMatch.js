var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var endpointMatch = require('../../../'+libFolder+'/middleware/endpointMatch');

var assert = require('assert');

describe("endpointMatch()", function () {

	describe("without endpoints", function () {
		var result = endpointMatch({},[]);
		it("result is null", function (){
			assert.strictEqual(null, result);
		});
	});

	describe("no matching", function () {
		var req = { path: "/truc/other" };
		var endpoint = { regexp: /^\/truc\/machin$/ };
		var result = endpointMatch(req, [endpoint] );
		it("result is null", function (){
			assert.strictEqual(null, result);
		});
	});

	describe("match without paramsName", function () {
		var req = { path: "/truc/machin" };

		var endpoint = { regexp: /^\/truc\/machin$/ };
		var result = endpointMatch(req, [endpoint] );
		it("result contains the matching endpoint", function () {
			assert.strictEqual(result.endpoint, endpoint);
		});
		it("result contains empty paramsValue", function () {
			assert.deepEqual(result.paramsValue, []);
		});
	});

	it("match with paramsName", function () {
		var req = { path: "/truc/machin" };

		var endpoint = { regexp: /^\/truc\/([^\/]*)$/ };
		var result = endpointMatch(req, [endpoint] );
		it("result contains the matching endpoint", function () {
			assert.strictEqual(result.endpoint, endpoint);
		});
		it("result contains the paramsValue", function () {
			assert.deepEqual(result.paramsValue, ["matchin"]);
		});
	});
});