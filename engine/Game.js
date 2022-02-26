const maxPlayers = 6;
const stateMap = {
	waiting: 0,
	ready: 1,
	ingame: 2,
	finished: 3
};

class Game {
	/**
	 * @type { Array : Player } players
	 * @type { Number } gameState
	 * @type { Object } stateMap
	 */

	players;
	gameState;

	/**
	 * @param { void }
	 */
	constructor() {
		this.players = [];
		this.gameState = stateMap.waiting;
	}

	/**
	 * @param { Player } newPlayer 
	 */
	addPlayer(newPlayer) {
		if (this.players.length === 6) {
			return false;
		}

		this.players.push(newPlayer);

		if (this.players.length === maxPlayers) {
			this.gameState = ready;
		}

		return true;
	}

	/**
	 * 
	 * @param { String } playerID
	 * @returns { Boolean } : if removeal is successful
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
