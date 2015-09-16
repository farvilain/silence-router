var assert = require('assert');

function assertNode(desc, node, path, childsNb, uses, methods){
	describe(desc, function(){
		it("path "+path, function(){
			assert.strictEqual(node.path, path);
		});
		it(childsNb+" childs", function(){
			assert.strictEqual(node.childs.length,childsNb);
		});
		it("has valid uses", function(){
			assert.deepEqual(node.uses,uses);
		});
		it("Has valid methods", function(){
			assert.deepEqual(node.methods, methods);
		});
		it("only expected properties", function(){
			assert.deepEqual(Object.keys(node).sort(), ["path","childs","uses","methods"].sort());
		});
	});
}

module.exports = assertNode;