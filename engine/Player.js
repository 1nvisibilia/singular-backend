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
	 * @param { Number } xCord
	 * @param { Number } yCord
	 * @param { Number } health
	**/
	constructor(xCord, yCord, health) {
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

export default Player;
