// this file defines an actual game that will be played

var Game = require('./game')

var g = new Game()

g.addNode('character', 'Welcome. Choose a charater to start.')
g.addNode('fido', 'Woof woof woof! 🐕')

g.addNode('paw', 'Well hello there sonny boy! 👴🏽')

g.addNode('yep', 'that is true')
g.addNode('wrong', 'you would be incorrect, friend')

g.connect('character', 'fido', 'Fido')
g.connect('character', 'paw', 'The Paw')

g.connect('fido', 'yep', 'blue')
g.connect('fido', 'wrong', 'green')
g.connect('fido', 'wrong', 'red')

module.exports = g