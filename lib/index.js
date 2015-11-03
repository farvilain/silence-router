var builder = require('./builder/builder');
var endpoint = require('./endpoint/');
var middleWare = require('./middleware/');

module.exports = function(options){
	options = options || {};
	var b = builder(options.defaultOptionMethod);
	b.createEndpoints = function(){
		return endpoint(b.getRoot());
	};
	b.createMW = function(badRequest, notAllowed){
		var endpoints = this.createEndpoints();
		return middleWare(endpoints, badRequest, notAllowed);
	};
	return b;
};