const up = "w";
const down = "s";
const left = "a";
const right = "d";
const moveSpeed = 3;

class Player {
	/**
	 * @type { Number } id
	 * @type { Number } xCord
	 * @type { Number } yCord
	 * @type { Number } nextX
	 * @type { Number } nextY
	 * @type { Number } health
	 */
	id;
	xCord;
	yCord;
	nextX;
	nextY;
	health;

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
		this.health = health;
	}

	/**
	 * @param { Object } inputData
	 * @returns { void }
	 */
	setNextMove(inputData) {
		if (inputData[up] === true && inputData[down] === true) {
			this.nextY = 0;
		} else if (inputData[up] === true) {
			this.nextY = 0 - moveSpeed;
		} else if (inputData[down] === true) {
			this.nextY = moveSpeed;
		} else {
			this.nextY = 0;
		}

		if (inputData[left] === true && inputData[right] === true) {
			this.nextX = 0;
		} else if (inputData[left] === true) {
			this.nextX = 0 - moveSpeed;
		} else if (inputData[right] === true) {
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
}

module.exports = Player;
