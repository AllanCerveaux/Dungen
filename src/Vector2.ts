export class Vector2 {
	constructor(public x: number, public y: number) {
	}

	/**
	 * Addition of two vectors
	 * @param vector
	 * @returns 
	 */
	add(vector: Vector2): Vector2 {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	}

	/**
	 * Substract of two vectors
	 * @param vector 
	 * @returns 
	 */
	substract(vector: Vector2): Vector2 {
		return new Vector2(this.x - vector.x, this.y + vector.y)
	}
	/**
	 * Multiply of two vectors
	 * @param scalar 
	 * @returns 
	 */
	multiply(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	/**
	 * Get length of the vector
	 * @returns 
	 */
	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	/**
	 * Normalize vector
	 * @returns 
	 */
	normalize(): Vector2 {
		const mag = this.magnitude();
		if (mag === 0) return new Vector2(0, 0);
		return new Vector2(this.x / mag, this.y / mag);
	}

	/**
	 * Distance between this vector and another vector
	 * @param vector 
	 * @returns 
	 */
	distanceTo(vector: Vector2): number {
		const dx = this.x - vector.x;
		const dy = this.y - vector.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	/**
	 * Calculates the scalar product of two vectors
	 * @param vector 
	 * @returns 
	 */
	dot(vector: Vector2): number {
		return this.x * vector.x + this.y * vector.y;
	}

	/**
	 * Get a copy of Vector2 in a new instance
	 * @returns 
	 */
	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	/**
	 * Get a Vector2 equal to zero only
	 */
	static get ZERO(): Vector2 {
		return new Vector2(0, 0)
	}
}