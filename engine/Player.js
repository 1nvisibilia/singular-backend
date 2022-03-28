const { PlayerData } = require("./EngineData.json");
const coolDownTime = PlayerData.shootingCoolDown;
const moveSpeed = PlayerData.moveSpeed;

class Player {
	/**
	 * @type { Number }
	 */
	static radius = PlayerData.radius;
	/**
	 * @type { Number } id
	 * @type { Number } xCord
	 * @type { Number } yCord
	 * @type { Number } nextX
	 * @type { Number } nextY
	 * @type { Number } health
	 * @type { Boolean } shootingCooldown
	 * @type { Number } impact
	 */
	id;
	xCord;
	yCord;
	nextX;
	nextY;
	health;
	shootingCooldown;
	impact;

	/**
	 * @param { String } id
	 * @param { Number } xCord
	 * @param { Number } yCord
	 * @param { Number } health
	**/
	constructor(id, xCord, yCord, health) {
		this.id = id;
		this.xCord = xCord;
		this.yCord = yCord;
		this.nextX = 0;
		this.nextY = 0;
		this.health = PlayerData.initHealth;
		this.impact = 0;
		this.shootingCooldown = false;
	}

	/**
	 * @returns { Number } the radius of a Player entity
	 */
	get radius() {
		return Player.radius;
	}

	/**
	 * @param { Object } inputData
	 * @returns { void }
	 */
	setNextMove(inputData) {
		if (inputData.up === true && inputData.down === true) {
			this.nextY = 0;
		} else if (inputData.up === true) {
			this.nextY = 0 - moveSpeed;
		} else if (inputData.down === true) {
			this.nextY = moveSpeed;
		} else {
			this.nextY = 0;
		}

		if (inputData.left === true && inputData.right === true) {
			this.nextX = 0;
		} else if (inputData.left === true) {
			this.nextX = 0 - moveSpeed;
		} else if (inputData.right === true) {
			this.nextX = moveSpeed;
		} else {
			this.nextX = 0;
		}
	}

	/**
	 * @returns { void }
	 */
	update() {
		this.xCord += this.nextX;
		this.yCord += this.nextY;
	}

	/**
	 * @returns { void }
	 */
	hasShot() {
		this.shootingCooldown = true;
		setTimeout(() => {
			this.shootingCooldown = false;
		}, coolDownTime);
	}
}

module.exports = Player;
