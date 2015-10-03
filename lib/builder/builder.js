var node = require('./node');

function builder(){
	var parents = [ node(null) ];

	var b = {
		getRoot : function(){
			return parents[parents.length-1];
		},
		getAct : function(){
			return parents[0];
		},
		path : function(path, _fcts){
			if(typeof path !== "string"){
				throw new Error("Expect string param");
			}

			var alreadyExists = parents[0].childs.some(function(child){
				if(path === child.path){
					parents.unshift(child);
					return true;
				}
			});
			
			if(alreadyExists){
				if(arguments.length > 1){
					throw new Error("Path "+path+" already exists but you give me some use fcts");
				}
				return this;
			}
			var newChild = node(path);
			parents[0].childs.push(newChild);
			parents.unshift(newChild);
			this.use.apply(this, Array.prototype.slice.call(arguments,1));
			return this;
		},
		use : function(_fcts) {
			Array.prototype.slice.call(arguments).forEach(function(fct){
				if(typeof fct !== "function"){
					throw new Error("Expect function param");
				}
				parents[0].uses.push(fct);
			});
			return this;
		},
		method : function(verb, _fct){
			if(typeof verb !== "string"){
				throw new Error("First param must be string");
			}
			
			var fcts = Array.prototype.slice.call(arguments, 1);
			if(fcts.length === 0){
				throw new Error("Expect at least one function for varargs second param");
			}
			fcts.some(function(fct){
				if(typeof fct !== "function"){
					throw new Error("Varargs second param must contains only functions");
				}
			});
		
			if(parents[0].methods[verb]){
				console.warn("You override the method",verb,"on path", parents[0].path);
			}
			parents[0].methods[verb] = fcts;
			return this;
		},
		parent : function(){
			if(parents.length === 0){
				console.warn("You asked parent but already on root");
			}
			parents.shift();
			return this;
		}
	};
	['HEAD','OPTIONS','GET','PUT','POST','DELETE', 'PATCH'].forEach(function(method){
		b[method.toLowerCase()] = b.method.bind(b, method);
	});
	return b;
}

module.exports = builder;