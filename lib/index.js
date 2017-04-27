var builder = require('./builder/');
var middleWare = require('./middleware/');

var chainExecutor = require('silence-chainexecutor');

module.exports = function(){
	var b = builder();
	b.createMW = function(badRequest, notAllowed){
		return middleWare(chainExecutor, b.getRoot(), badRequest, notAllowed);
	};
	return b;
};