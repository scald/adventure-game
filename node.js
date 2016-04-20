var Connection = require('./connection');

var Node = function(title, text) {
	this.title = title;
	this.text = text;
	this.connections = [];	
	this.conditions = {};
};

// Construct a new connection from the Connection constructor and push it on to the Node
Node.prototype.connect = function(destination, condition) {
	var connection = new Connection(destination, condition);
	if(this.conditions.hasOwnProperty(condition)){
		var error = new Error("The condition " + this.condition + " already exists.");
		throw error;
	} else {
		this.connections.push(connection);
		// this.conditions[condition] = this.connections[this.connections.length - 1];
		this.conditions[condition] = connection;
	}
};


module.exports = Node;
