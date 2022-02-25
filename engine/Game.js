const maxPlayers = 6;
const stateMap = {
	waiting: 0,
	ready: 1,
	ingame: 2,
	finished: 3
};

class Game {
	// /**
	//  * @type { Array : Player } players
	//  * @type { Number } gameState
	//  * @type { Object } stateMap
	//  */
	players;
	gameState;

	/**
	 * @param { void }
	 */
	constructor() {
		this.players = new Array(maxPlayers);
		this.players.fill(null);
		Object.seal(this.players);
		this.gameState = stateMap.waiting;
	}

	/**
	 * @param { Player } newPlayer 
	 */
	addPlayer(newPlayer) {
		this.players.push(newPlayer);

		if (this.players.length === maxPlayers) {
			this.gameState = ready;
		}
	}
}

module.exports = Game;