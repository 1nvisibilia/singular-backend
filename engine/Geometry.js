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
	 * @param { Number } x1
	 * @param { Number } y1
	 * @param { Number } x2
	 * @param { Number } y2
	 * @returns { Number } the distance between point x and point y
	 */
	static twoPointsDistance(x1, y1, x2, y2) {
		const xDelta = x2 - x1;
		const yDelta = y2 - y1;
		return Math.sqrt(xDelta ** 2 + yDelta ** 2);
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
