var Node = require('./node');

var Game = function() {
	this.nodes = {};
	this.startingPoint = null;
};

// adding a new node from the Node constructor function to the nodes object found on the Game constructor
Game.prototype.addNode = function(title, text){
	if(this.nodes.hasOwnProperty(title)) {
		var error = new Error("The node " + this.title + " already exists.");
		throw error;
	} else {
		var node = new Node(title, text);
		this.nodes[title] = node;
		if(this.startingPoint === null) {
			this.startingPoint = node;
			//this.startingPoint = this.startingPoint || node
		}
		return node;
	}
};

Game.prototype.getNode = function(title) {
	return this.nodes[title];
};

// Game.prototype.connect = function(node1, node2) {
// 	this.nodes[node1].connect(this.nodes[node2], this.nodes[node2].conditions);
// }

//takes 2 strings and a condition which is also a string
Game.prototype.connect = function(title1, title2, condition){
	// Node.prototype.connect.call(this.getNode(title1), this.getNode(title2), condition);
	//^^^^ works but won't pass due to the spy test spec
	this.getNode(title1).connect(this.getNode(title2), condition)


}

module.exports = Game;
