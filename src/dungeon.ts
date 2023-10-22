import { Vector2 } from "./Vector2";
import { Room } from "./room";
import { RoomType } from "./type";
import { DUNGEON_MAX_SIZE, create2DArray, getRandomInt, hasChance } from "./utils";

export class Dungeon {
	private _size: Record<'width' | 'height', number> = DUNGEON_MAX_SIZE
	private _preset_room: Record<'start' | 'end', Room | undefined> = {
		start: undefined,
		end: undefined
	}
	private roomCount: number = 0
	public grid: (Room | null)[][] = []

	constructor() {
		this.grid = create2DArray<Room | null>(this._size.width, this._size.height, null)
	}

	generate() {
		this.generateStartRoom()
		this.generateRooms()
		this.validateAllDoors()
	}

	generateRooms() {
		let current_room = this._preset_room.start
		let stack = [current_room]

		while (stack.length > 0) {
			current_room = stack.pop()

			if (!current_room) continue

			const neighbors = current_room.getNeighborPos()

			for (const neighbor of neighbors) {
				if (
					!this.isValidPosition(neighbor.x, neighbor.y) ||
					this.getRoomByPosition(neighbor.x, neighbor.y)
				) continue
				const generationChance = this.getGenerationProbability(new Vector2(neighbor.x, neighbor.y))
				if (hasChance(generationChance)) {
					const newRoom = this.addRoom(neighbor.x, neighbor.y)
					newRoom.linkDoor(neighbor.direction)
					stack.push(newRoom)
				}
			}
		}
	}

	validateAllDoors() {
		for (const room of this.grid.flat()) {
			if (room) {
				for (const door of room.doors) {
					const neighborPos = room.getNeighborAtDirection(door.direction)
					if (!neighborPos) continue
					const neighbor = this.getRoomByPosition(neighborPos.x, neighborPos.y)
					if (!neighbor) {
						door.desactivate()
					} else {
						const oppositeDirection = room.getOppositeDirection(door.direction)
						const neighborDoor = neighbor.getDoorByDirection(oppositeDirection)
						if (!neighborDoor) {
							door.desactivate()
						}
					}
				}
			}
		}
	}

	getGenerationProbability(roomPos: Vector2) {
		const startRoom = this._preset_room.start;
		if (!startRoom) return 0

		const distanceToStart = startRoom.position.distanceTo(roomPos)

		const maxDistance = Math.sqrt(this._size.width ** 2 + this._size.height ** 2)

		const proximityFactor = (maxDistance - distanceToStart) / maxDistance;

		return proximityFactor * 100
	}

	getRoomByPosition(x: number, y: number): Room | null {
		return this.grid[y][x]
	}

	private addRoom(x: number, y: number, type: RoomType = 'normal') {
		const newRoom = new Room(new Vector2(x, y), type)
		this.grid[y][x] = newRoom

		if (type !== 'normal') this._preset_room[type] = newRoom

		newRoom.generateDoor()
		this.roomCount++

		return newRoom
	}

	private isValidPosition(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this._size.width && y < this._size.height;
	}

	private generateStartRoom(): void {
		const x = getRandomInt(0, this._size.width);
		const y = getRandomInt(0, this._size.height);
		const room = this.addRoom(x, y, 'start');

		if (room.doorCount < 1) room.generateDoor()
	}

	html(): HTMLDivElement {
		const dungeonElement = document.createElement('div');

		dungeonElement.innerHTML = '';
		this.grid.forEach((row) => {
			const rowElement = document.createElement('div');
			rowElement.classList.add('row')
			row.forEach((cell) => {
				const cellElement = document.createElement('div');
				cellElement.classList.add('cell');

				if (cell) {
					cellElement.appendChild(cell.html());
				}
				rowElement.appendChild(cellElement);
			})
			dungeonElement.appendChild(rowElement);
		})

		return dungeonElement
	}
}