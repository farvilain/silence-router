function node(path, parent){
	return {
		parent : parent,
		path : path,
		before : [],
		after : [],
		methods : {},
		children : []
	};
}

module.exports = node;