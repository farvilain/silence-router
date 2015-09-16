function createChainExecutor(fcts, req, res, final) {
	var i = -1;
	//TODO Should throw an error if fcts.length === 0

	function chainExecutor(err){
		i++;

		if(err){
			return final(err);
		}

		if(fcts.length === i){
			return final();
		}
		//TODO It should be nice to refuse chainExecutor to be called more than once by each function
		fcts[i](req, res, chainExecutor);
	}

	return chainExecutor;
}

module.exports = createChainExecutor;