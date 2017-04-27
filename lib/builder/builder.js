var node = require('./node');

module.exports = builder;

function builder(){
	var parents = [ node("") ];
	parents.bottom = function(){
		return parents[0]
	};
	parents.top = function(){
		return parents[parents.length-1]
	};


	var b = {
		getRoot : function(){
			return parents[parents.length-1];
		},
		getAct : function(){
			return parents[0];
		},
		path : function(path, _fcts){
			if(typeof path !== "string"){
				throw new Error(".path() expects first params to be 'string', as pathName");
			}
			var alreadyExists = parents[0].children.some(function(child){
				if(path === child.path){
					parents.unshift(child);
					return true;
				}
			});
			
			if(alreadyExists){
				if(arguments.length > 1){
					throw new Error(".path("+path+") already exists AND you give me some 'before'");
				}
				return this;
			}

			var newChild = node(path, parents[0]);
			parents[0].children.push(newChild);
			parents.unshift(newChild);
			this.before.apply(this, Array.prototype.slice.call(arguments,1));
			return this;
		},
		before : function(_fcts) {
			oneLevelArray(Array.prototype.slice.call(arguments))
			.forEach(function(fct){
				if(typeof fct !== "function"){
					throw new Error(".before(_fcts) only accepts functions in argument (can be neested in arrays)");
				}
				parents[0].before.push(fct);
			});
			return this;
		},
		after : function(_fcts) {
			oneLevelArray(Array.prototype.slice.call(arguments))
			.forEach(function(fct){
				if(typeof fct !== "function"){
					throw new Error(".after(_fcts) only accepts functions in argument (can be neested in arrays)");
				}
				parents[0].after.push(fct);
			});
			return this;
		},
		method : function(verb, name, _fct){
			if(typeof verb !== "string"){
				throw new Error(".method() First param must be string, the verb to use (GET, POST, ...)");
			}
			if(typeof name !== "string"){
				throw new Error(".method() Second param must be string, name of the request");
			}
			
			var fcts = oneLevelArray(Array.prototype.slice.call(arguments, 2));
			if(fcts.length === 0){
				throw new Error(".method() expects at least one function for third params (can be neested in arrays)");
			}
			fcts.some(function(fct){
				if(typeof fct !== "function"){
					throw new Error(".after(_fcts) only accepts functions in third argument (can be neested in arrays)");
				}
			});
		
			if(parents[0].methods[verb]){
				process.stderr.write("You override the method " + verb + " on path :" + parents[0].path + "\n");
			}
			parents[0].methods[verb] = {
				fcts : fcts
			};
			parents[0].methods[verb].name = name;

			return this;
		},
		parent : function(){
			if(parents.length === 0){
				process.stderr.write("You asked parent but already on root.\n");
			}
			parents.shift();
			return this;
		}
	};
	['HEAD','OPTIONS','GET','PUT','POST', 'PATCH'].forEach(function(method){
		b[method.toLowerCase()] = b.method.bind(b, method);
	});
	b['del'] = b.method.bind(b,'DELETE');
	return b;
}


const oneLevelArray = arr => arr.reduce(
  (a, b) => a.concat(
    Array.isArray(b) ? oneLevelArray(b) : b
  ),
  []
);