export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
export function create2DArray<T>(width: number, height: number, value?: T): T[][] {
	return [...Array(height)].map(() => Array(width).fill(value));
}

export const DUNGEON_MAX_SIZE = {
	width: 4,
	height: 4
}