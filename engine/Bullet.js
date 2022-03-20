const moveSpeed = 4;

class Bullet {
	/**
	 * @type { Number }
	 */
	xCord;

	/**
	 * @type { Number }
	 */
	yCord;

	/**
	 * @type { Number }
	 */
	nextX;

	/**
	 * @type { Number }
	 */
	nextY;

	/**
	 * @param { Number } xCord
	 * @param { Number } yCord
	 * @param { Number } nextX
	 * @param { Number } nextY
	 */
	constructor(xCord, yCord, nextX, nextY) {
		this.xCord = xCord;
		this.yCord = yCord;
		this.nextX = nextX;
		this.nextY = nextY;
	}

	/**
	 * @returns { void }
	 */
	update() {
		this.xCord += this.nextX;
		this.yCord += this.nextY;
	}
}

module.exports = Bullet;
