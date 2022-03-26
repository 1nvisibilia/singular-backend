class Geometry {
	/**
	 * @param { Number } startX
	 * @param { Number } startY
	 * @param { Number } endX
	 * @param { Number } endY
	 * @returns { Number }
	 */
	static twoPointsAngle(startX, startY, endX, endY) {
		const xDelta = endX - startX;
		const yDelta = endY - startY;
		// Same as Math.atan(yDelta / xDelta)
		return Math.atan2(yDelta, xDelta);
	}

	/**
	 * @param { Number } angle
	 * @returns { { x: Number, y: Number } } a unit vector
	 */
	static unitVector(angle) {
		return {
			x: Math.cos(angle),
			y: Math.sin(angle)
		};
	}
}

module.exports = Geometry;
