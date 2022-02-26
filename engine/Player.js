class Player {
	/**
	 * @type { Number } id
	 * @type { Number } xCord
	 * @type { Number } yCord
	 * @type { Number } health
	 */
	id;
	xCord;
	yCord;
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
		this.health = health;
	}

	/**
	 * @param { Number } moveX 
	 * @param { Number } moveY 
	 */
	move(moveX, moveY) {
		this.xCord += moveX;
		this.yCord += moveY;
	}
}

module.exports = Player;
