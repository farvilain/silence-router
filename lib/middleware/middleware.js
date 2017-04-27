var logger = require('silence-log').get('silence.router.middleware');

module.exports = createMiddleWare;

function pathMatch(path, value){
	if(!path.startsWith(":")){
		return path === value;
	}

	return {
		name : path.substr(1)
		,value : value
	};
}

function findResourceRec(resource, paths, result){
	var thisPath = paths[0];

	var match = pathMatch(resource.path, thisPath);

	//Don't match
	if(match === false){
		return false;
	}


	//We tak path params if presents
	if(match !== true){
		result.params[match.name] = match.value;
	}

	//We add all before mw to the list
	resource.before.forEach(function(u){
		result.middlewares.push(u);
	});

	//We will continue
	paths.shift();

	//It's the wanted resource, we can stop
	if(paths.length === 0){
		result.resource = resource;

		return true;
	}

	//We goes throught sub resources
	var subMatch = resource.children.some(sub=>{
		return findResourceRec(sub, paths, result);
	});

	//We add all after mw to the list
	resource.after.forEach(function(a){
		result.middlewares.push(a);
	});

	return subMatch;
}

function findResource(paths, api){
	var result = {
		resource : null
		,params : {}
		,middlewares : []
	};
	var found = findResourceRec(api, paths, result);
	if(found){
		return result;
	}
	return false;	
}

function createMiddleWare(chainExecutor, endpoints, badRequest, notAllowed){

	return function silenceMW(req, res, next){
		var cleanedPath = req.path;
		if(cleanedPath === '/'){
			cleanedPath = "";
		}
		var match = findResource(cleanedPath.split('/'), endpoints);
		if(match === false){
			return badRequest(req, res, next);
		}

		req.pathParams = {};
		Object.keys(match.params)
		.forEach(function(name){
			req.pathParams[name] = match.params[name];
		});

		var resource = match.resource;
		res.matchedResource =  resource;
		
		var method = resource.methods[req.method];
		if(!method){
			return notAllowed(req, res, next);
		}


		req.requestName = method.name;
		var fcts = match.middlewares.concat(method.fcts);

		chainExecutor(fcts, next)(req, res);
	};
}