const Player = require("./Player");

const maxPlayers = 6;
const stateMap = {
	waiting: 0,
	ready: 1,
	ingame: 2,
	finished: 3
};
const initialPositions = [
	[100, 100],
	[200, 100],
	[300, 100],
	[100, 200],
	[200, 200],
	[300, 200]
];

class Game {
	/**
	 * @typedef { { players: Player[], gameState: Number } } Game
	 * @typedef { { health: Number} } Attribute
	 */

	/**
	 * @type { Player[] } players
	 */
	players;
	/**
	 * @type { Number } gameState
	 */
	gameState;

	/**
	 * @param { void }
	 */
	constructor() {
		this.players = [];
		this.gameState = stateMap.waiting;
	}

	/**
	 * @param { Number } newPlayerID
	 * @param { Attribute } attributes
	 * @returns { Player } : the player added or null if unsuccessful
	 */
	addPlayer(newPlayerID, attributes) {
		if (this.players.length === 6) {
			return null;
		}

		const position = initialPositions[this.players.length];

		const newPlayer = new Player(newPlayerID, position[0], position[1], attributes.health);
		this.players.push(newPlayer);

		if (this.players.length === maxPlayers) {
			this.gameState = stateMap.ready;
		}

		return newPlayer;
	}

	/**
	 * 
	 * @param { String } playerID
	 * @returns { Boolean } : if removal is successful
	 */
	removePlayer(playerID) {
		const disconnectedUserId = this.players.findIndex(player => player.id === playerID);
		if (disconnectedUserId !== -1) {
			this.players.splice(disconnectedUserId, 1);
			return true;
		}
		return false;
	}
}

module.exports = Game;
