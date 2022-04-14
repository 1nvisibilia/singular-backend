const Bullet = require("./Bullet");
const Geometry = require("./Geometry");
const Player = require("./Player");

const move = "move";
const click = "click";
const both = "both";
const maxPlayers = 6;
const stateMap = { // do we need this?
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
	 * @type { Player[] } players
	 */
	players;
	/**
	 * @type { String[] } killedPlayerQueue
	 */
	killedPlayerQueue;
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
		this.players = [];
		this.killedPlayerQueue = [];
		this.spots = new Array(maxPlayers);
		this.spots.fill(true);
		Object.seal(this.spots);
		this.gameState = stateMap.waiting;
		this.bullets = [];
	}

	/**
	 * @returns { Boolean } if the game is full
	 */
	isFull() {
		return this.players.length === maxPlayers;
	}

	/**
	 * @returns { Boolean } if there are no players in the game
	 */
	isEmpty() {
		return this.players.length === 0;
	}

	/**
	 * @param { String } newName
	 * @returns { Boolean } true if this name already exist in the game, false otherwise
	 */
	nameExist(newName) {
		const exist = this.players.find((player) => {
			return player.name === newName;
		});
		if (exist === undefined) {
			return false;
		}
		return true;
	}

	/**
	 * @param { String } newPlayerID
	 * @param { String } playerName
	 * @returns { Player } the player added or null if unsuccessful
	 */
	addPlayer(newPlayerID, playerName) {
		if (this.isFull()) {
			return null;
		}

		const index = this.spots.findIndex(spot => spot);
		const position = initialPositions[index];
		this.spots[index] = false;

		const newPlayer = new Player(newPlayerID, playerName, position[0], position[1]);
		this.players.push(newPlayer);

		// if (this.players.length === maxPlayers) {
		// 	this.gameState = stateMap.ready;
		// }

		return newPlayer;
	}

	/**
	 * @param { String } playerID
	 * @returns { String } the name of the player removed
	 */
	removePlayer(playerID) {
		const disconnectedUserIndex = this.players.findIndex(player => player.id === playerID);
		if (disconnectedUserIndex !== -1) {
			const playerLeftName = this.players[disconnectedUserIndex].name;
			this.players.splice(disconnectedUserIndex, 1);
			this.spots[disconnectedUserIndex] = true;
			return playerLeftName;
		}
		return null;
	}

	/**
	 * @param { Player | Bullet } entity1
	 * @param { Player | Bullet } entity2
	 * @returns { void }
	 */
	updateCollision(entity1, entity2) {
		const distance = Geometry.twoPointsDistance(
			entity1.xCord,
			entity1.yCord,
			entity2.xCord,
			entity2.yCord
		);

		if (distance < entity1.radius + entity2.radius) {
			++entity1.impact;
			++entity2.impact;
		}
	}

	/**
	 * Check if there are any collisions among all entities, and update entities based on
	 * their collisions
	 * @returns { void }
	 */
	checkCollision() {
		// Bullet/Bullet Collision
		for (let i = 0; i < this.bullets.length; ++i) {
			if (this.bullets[i].impact > 0) {
				continue;
			}
			for (let j = i + 1; j < this.bullets.length; ++j) {
				if (this.bullets[j].impact > 0) {
					continue;
				}
				this.updateCollision(this.bullets[i], this.bullets[j]);
			}
		}

		// Bullet/Player Collision
		for (let i = 0; i < this.players.length; ++i) {
			if (this.players[i].health <= 0) {
				continue;
			}
			for (let j = 0; j < this.bullets.length; ++j) {
				if (this.bullets[j].impact > 0) {
					continue;
				}
				this.updateCollision(this.players[i], this.bullets[j]);
			}
		}

		// Player/Player Collision
		/**
		 * @param { This is currently disable, we will add 'attackDamage' field to player and bullet }
		 */
		// for (let i = 0; i < this.players.length; ++i) {
		// 	if (this.players[i].health <= 0) {
		// 		continue;
		// 	}
		// 	for (let j = i + 1; j < this.players.length; ++j) {
		// 		if (this.players[j].health <= 0) {
		// 			continue;
		// 		}
		// 		// currently, player player collision does not do anything
		// 		this.updateCollision(this.players[i], this.players[j]);
		// 		if (this.players[i].health <= 0) {
		// 			this.killedPlayerQueue.push(this.players[i].name);
		// 		}
		// 		if (this.players[j].health <= 0) {
		// 			this.killedPlayerQueue.push(this.players[j].name);
		// 		}
		// 	}
		// }

		// Remove all collided bullets.
		for (let i = this.bullets.length - 1; i >= 0; --i) {
			if (this.bullets[i].impact > 0) {
				this.bullets.splice(i, 1);
			}
		}

		// Update Players Health
		this.players.forEach((player) => {
			if (player.health <= 0) {
				return;
			}
			if (player.impact !== 0) {
				player.health -= player.impact;
				player.impact = 0;
			}
			if (player.health <= 0) {
				this.killedPlayerQueue.push(player.name);
			}
		});
	}

	/**
	 * @param { Map } InputMap
	 */
	updateEntities(InputMap) {
		// flush all the previously killed player names
		this.killedPlayerQueue = [];

		// Change players' next move
		for (const [PlayerID, inputData] of InputMap.entries()) {
			if (inputData === null) {
				continue;
			}

			const currentPlayer = this.players.find((player) => player.id === PlayerID);
			if (currentPlayer === undefined || currentPlayer.health <= 0) {
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
				this.bullets.push(new Bullet(
					currentPlayer.xCord + (Player.radius + Bullet.radius) * unitVector.x,
					currentPlayer.yCord + (Player.radius + Bullet.radius) * unitVector.y,
					unitVector.x,
					unitVector.y));
			}
		}

		// Change players moves
		this.players.forEach((player) => {
			if (player.health > 0) {
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

		// Checking for collisions
		this.checkCollision();
	}
}

module.exports = Game;
