class Geometry {
	/**
	 * @param { Number } startX
	 * @param { Number } startY
	 * @param { Number } endX
	 * @param { Number } endY
	 */
	static twoPointsAngle(startX, startY, endX, endY) {
		const xDelta = endX - startX;
		const yDelta = endY - startY;
		// Same as Math.atan(yDelta / xDelta)
		return Math.atan2(yDelta, xDelta);
	}
}

module.exports = Geometry;