var logger = require('silence-log').get('silence.router.chainExecutor');

function createChainExecutor(fcts, req, res, final) {
	logger.debug("Creating with " + fcts.length + " functions");
	fcts.forEach(function(f, index){
		logger.debug("  =>" + index + ":" + f.name)
	});

	var i = -1;
	//TODO Should throw an error if fcts.length === 0

	function chainExecutor(err){
		i++;

		if(err){
			logger.error("Exit on error:"+err);
			return final(err);
		}

		if(fcts.length === i){
			logger.debug("Ends successfully");
			return final();
		}
		logger.debug("Running ("+i+"/"+fcts.length+")"+ fcts[i].name);
		//TODO It should be nice to refuse chainExecutor to be called more than once by each function
		fcts[i](req, res, chainExecutor);
	}

	return chainExecutor;
}

module.exports = createChainExecutor;