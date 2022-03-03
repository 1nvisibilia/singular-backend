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
	 * @typedef { { health: Number } } Attribute
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
	 * @type { Boolean[] } spots
	 */
	spots;

	/**
	 * @param { void }
	 */
	constructor() {
		this.players = new Array(maxPlayers);
		this.players.fill(null);
		Object.seal(this.players);
		this.spots = new Array(maxPlayers);
		this.spots.fill(true);
		Object.seal(this.spots);
		this.gameState = stateMap.waiting;
	}

	/**
	 * @param { Number } newPlayerID
	 * @param { Attribute } attributes
	 * @returns { Player } : the player added or null if unsuccessful
	 */
	addPlayer(newPlayerID, attributes) {
		const index = this.spots.findIndex(spot => spot);
		if (index === -1) {
			return null;
		}

		const position = initialPositions[index];
		this.spots[index] = false;

		const newPlayer = new Player(newPlayerID, position[0], position[1], attributes.health);
		this.players[index] = newPlayer;

		// if (this.players.length === maxPlayers) {
		// 	this.gameState = stateMap.ready;
		// }

		return newPlayer;
	}

	/**
	 * 
	 * @param { String } playerID
	 * @returns { Boolean } : if removal is successful
	 */
	removePlayer(playerID) {
		const disconnectedUserIndex = this.players.findIndex(player => player && player.id === playerID);
		if (disconnectedUserIndex !== -1) {
			this.players[disconnectedUserIndex] = null;
			this.spots[disconnectedUserIndex] = true;
			return true;
		}
		return false;
	}
}

module.exports = Game;
