var middleWare = require('./middleware');

module.exports = function(chainExecutor, endpoints, badRequest, notAllowed){
	return middleWare(chainExecutor, endpoints, badRequest, notAllowed);
};