"use strict";

var inquirer = require('inquirer');

var game = require('./game.source');

// Play takes a node and returns a promise for the last node
function play(node){
	if(!node.connections.length){
	    console.log(node.text);
	    return Promise.resolve({node});  // Note: `{node}` is ES6 object shorthand syntax. ES5 would be Promise.resolve({node: node})
  	}
 	// if(node.connections.length === 0){
 	// 	console.log(node.text);
 	// 	console.log('game over');
 	// 	play(game.startingPoint);
 	// 	return;
 	// }

	return inquirer.prompt([
		{
		name: 'choice',
		message: node.text,
		type: 'list',
		choices: node.connections,
		}]
		).then(function(answer){
			return play(answer.choice);
		});
}

play(game.startingPoint).then(last => console.log('Game over.'));

/**

This file has no test specs. It might be a tricky one. You need to look at
the docs for the inquirer npm package, and see if you can figure out how
to make the game run!

If you're running out of time, check out our solution to the problem:

https://gist.github.com/queerviolet/7d9fb275b292b062fa5b9b4c99eda77d

**/
