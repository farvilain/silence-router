function createAccumulator(endpoint, pathsToRegexp){
	var result = [];

	function accumulator(methods, pathList, uses){
		if ( Object.keys(methods).length !== 0 ) {
			var regexpAndParamNames = pathsToRegexp(pathList);
			var paramNames = [];

			var endpt = endpoint(regexpAndParamNames.regexp, regexpAndParamNames.paramNames);

			Object.keys(methods).forEach(function(verb) {
				endpt.methods[verb] = uses.concat(methods[verb]);
			});

			result.push(endpt);
		}
	}
	accumulator.result = result;
	return accumulator;
}

module.exports = createAccumulator;
