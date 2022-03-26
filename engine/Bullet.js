const { CanvasData, BulletData } = require("./EngineData.json");
const moveSpeed = BulletData.moveSpeed;

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
		this.xCord += this.nextX * moveSpeed;
		this.yCord += this.nextY * moveSpeed;
	}

	/**
	 * @returns { Boolean } if the bullet has fly off the board
	 */
	outOfScope() {
		if (this.xCord >= -BulletData.radius &&
			this.xCord <= CanvasData.width + BulletData.radius &&
			this.yCord >= -BulletData.radius &&
			this.yCord <= CanvasData.height + BulletData.radius) {
			return false;
		}
		return true;
	}
}

module.exports = Bullet;
