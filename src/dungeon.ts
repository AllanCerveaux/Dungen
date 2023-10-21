import { Room } from "./room";
import { RoomType } from "./type";
import { DUNGEON_MAX_SIZE, create2DArray, getRandomInt, hasChance } from "./utils";

export class Dungeon {
	private _size = {
		width: DUNGEON_MAX_SIZE.width,
		height: DUNGEON_MAX_SIZE.height,
	};
	private _preset_room: Record<"Depart" | "End", Room | null> = {
		Depart: null,
		End: null,
	};
	private roomCount: number = 0
	grid: (Room | null)[][] = [];

	generate() {
		this.generateDungeon();
		this.generateRooms();
		this.validateAllDoors()
	}

	generateDungeon() {
		this.grid = create2DArray(this._size.width, this._size.height, null);
	}

	generateRooms() {
		this.generateStartRoom();

		let current_room: Room | null | undefined = this._preset_room.Depart;
		let stack = [current_room];

		while (stack.length > 0) {
			current_room = stack.pop();
			if (this.roomCount >= 20) {
				break;
			}
			if (!current_room) continue
			const neighbors = current_room.getNeighborPos();
			for (const neighbor of neighbors) {
				if (!this.isValidPosition(neighbor.x, neighbor.y) || this.getRoomByPosition(neighbor.x, neighbor.y)) {
					continue;
				}

				const generationChance = this.getGenerationProbability(neighbor.x, neighbor.y);

				if (hasChance(generationChance)) {
					const newRoom = this.addRoom(neighbor.x, neighbor.y);
					newRoom.link(neighbor.direction);
					stack.push(newRoom);
				}
			}
		}
	}

	private generateStartRoom(): void {
		const x = getRandomInt(0, this._size.width);
		const y = getRandomInt(0, this._size.height);
		this.addRoom(x, y, 'Depart');
	}

	private validateAllDoors(): void {
		for (const row of this.grid) {
			for (const room of row) {
				if (room) this.validateRoomDoors(room);
			}
		}
	}

	validateRoomDoors(room: Room) {
		for (const [direction, doorData] of room.doors_entries) {
			if (!doorData.active) continue;

			const neighborPos = room.getNeighborAtDirection(direction);
			if (!neighborPos) continue;

			const neighbor = this.getRoomByPosition(neighborPos.x, neighborPos.y);
			if (!neighbor) {
				doorData.active = false; // Disable the door if there's no neighboring room
			} else {
				const oppositeDirection = room.getReverseDirection(direction);
				const neighborDoor = neighbor.doors[oppositeDirection];
				if (!neighborDoor.active) {
					doorData.active = false; // Disable the door if the neighboring room's door is inactive
				}
			}
		}
	}

	isValidPosition(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this._size.width && y < this._size.height;
	}

	addRoom(x: number, y: number, type: RoomType = 'Normal') {
		const newRoom = new Room({ x, y }, type);
		this.grid[y][x] = newRoom;

		if (type !== 'Normal') {
			this._preset_room[type] = newRoom;
		}
		newRoom.generateDoor()
		this.roomCount++;

		return newRoom;
	}

	getRoomByPosition(x: number, y: number): Room | null {
		return this.grid[y][x]
	}

	getGenerationProbability(x: number, y: number): number {
		const centerX = this._size.width / 2;
		const centerY = this._size.height / 2;

		const distanceToCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
		const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

		const proximityFactor = (maxDistance - distanceToCenter) / maxDistance;

		return Math.min((proximityFactor * 100) + 50, 100);
	}

	drawHTML() {
		const dungeonElement = document.getElementById('app');
		if (!dungeonElement) return

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
	}
}