var assert = require('assert');
var libFolder =  process.env.COVERAGE ? 'lib-cov' : 'lib';
var builder = require('../../../'+libFolder+'/builder/builder.js');
var assertNode = require('../../util/assertNode');

var f1 = function(){};
var f2 = function(){};
var f3 = function(){};

describe("builder", function(){
	describe("method()", function(){
		it("is existing function", function(){
			var b = builder();
			assert.ok(b.method);
			assert.strictEqual(typeof b.method, "function");
		});
		it("returns the builder", function(){
			var b = builder();
			assert.strictEqual(b.method("GET", function(){}), b);
		});
		it("do not modify actual", function(){
			var b = builder();
			var act = b.getAct();
			b.method("GET", function(){});
			assert.strictEqual(b.getAct(), act);
		});
		it("add the method", function(){
			var b = builder();
			b.method("GET", f1);
			assert.deepEqual(b.getAct().methods, {"GET": {fcts:[f1]}});
		});
		it("add the name if provided", function(){
			var b = builder();
			b.method("GET", "test",f1);
			assert.deepEqual(b.getAct().methods, {"GET": {name:'test',fcts:[f1]}});
		});
		it("add all the methods", function(){
			var b = builder();
			b.method("GET", f1, f2);
			assert.deepEqual(b.getAct().methods, {"GET": {fcts:[f1,f2]}});
		});
		it("refuses empty list functions", function(){
			assert.throws(function(){
				builder().method("GET");
			}, / Expect at least one function for varargs second param/);
		});
		[null, undefined, 1, function(){}, [], {} , /abc/].forEach(function(badValue){
			it("refuses first param "+badValue, function(){
				assert.throws(function(){
					builder().method(badValue, function(){});
				}, /First param must be string/);
			});
		});

		[null, undefined, 1,  [], {} , /abc/].forEach(function(badValue){
			it("refuses second param "+badValue, function(){
				assert.throws(function(){
					builder().method("GET", badValue);
				}, /Varargs second param must contains only functions/);
			});
			it("refuses third param "+badValue, function(){
				assert.throws(function(){
					builder().method("GET", f1, badValue);
				}, /Varargs second param must contains only functions/);
			});
		});
		it("add a default OPTION", function(){
			var b = builder(f2);
			b.method("GET", f1);
			assert.deepEqual(b.getAct().methods, {"GET":{ fcts : [f1]}, "OPTIONS": { fcts : [f2]}});
		});
		it("add a default OPTION as array", function(){
			var b = builder([f3,f2]);
			b.method("GET", f1);
			assert.deepEqual(b.getAct().methods, {"GET":{ fcts : [f1]}, "OPTIONS": { fcts : [f3, f2]}});
		});
		it("do not override presseted OPTIONS", function(){
			var b = builder([f3]);
			b.method("OPTIONS", f2);
			b.method("GET",f1)
			assert.deepEqual(b.getAct().methods, {"GET":{ fcts : [f1]}, "OPTIONS": { fcts : [f2]} });
		});
		it("can override default OPTIONS", function(){
			var b = builder([f3]);
			b.method("GET",f1)
			b.method("OPTIONS", f2);
			assert.deepEqual(b.getAct().methods, {"GET": { fcts : [f1] }, "OPTIONS": { fcts : [f2] } });
		});

	});
});
