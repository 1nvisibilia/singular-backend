const Bullet = require("./Bullet")
const Geometry = require("./Geometry");
const Player = require("./Player");

const move = "move";
const click = "click";
const both = "both";
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
	 * @type { Bullet[] } bullets
	 */
	bullets;
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
		this.bullets = [];
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

	/**
	 * @param { Map } InputMap
	 */
	updateEntities(InputMap) {
		// Change players' next move
		for (const [PlayerID, inputData] of InputMap.entries()) {
			if (inputData === null) {
				continue;
			}

			const currentPlayer = this.players.find((player) => player !== null && player.id === PlayerID);
			if (currentPlayer === undefined) {
				continue;
			}

			if (inputData.type === move || inputData.type === both) {
				currentPlayer.setNextMove(inputData);
			}

			if (inputData.type === click || inputData.type === both) {
				if (currentPlayer.shootingCooldown) {
					continue;
				}
				currentPlayer.hasShot();

				const angle = Geometry.twoPointsAngle(
					currentPlayer.xCord,
					currentPlayer.yCord,
					inputData.mouse.xCord,
					inputData.mouse.yCord
				);
				const unitVector = Geometry.unitVector(angle);
				// we want to change the init coordinate later on, not directly inside the player.
				this.bullets.push(new Bullet(currentPlayer.xCord, currentPlayer.yCord, unitVector.x, unitVector.y));
			}
		}

		// Change players moves
		this.players.forEach((player) => {
			if (player !== null) {
				player.update();
			}
		});

		// Change bullets moves while removing out of screen bullets
		for (let i = this.bullets.length - 1; i >= 0; --i) {
			if (this.bullets[i].outOfScope() === true) {
				this.bullets.splice(i, 1);
			} else {
				this.bullets[i].update();
			}
		}
	}
}

module.exports = Game;
