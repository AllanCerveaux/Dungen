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
		this.validateAllDoors();
		this.generateEndRoom();
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

	generateEndRoom(): void {
		const potentialBossRooms = [];
		for (const row of this.grid) {
			for (const room of row) {
				if (room && room.doors_active.length === 1 && room.type !== 'Depart') {
					potentialBossRooms.push(room);
				}
			}
		}
		if (potentialBossRooms.length > 0) {
			const chosenBossRoom = potentialBossRooms[getRandomInt(0, potentialBossRooms.length)];
			chosenBossRoom.type = 'End'
		}
	}

	validateRoomDoors(room: Room) {
		for (const [direction, doorData] of room.doors_entries) {
			if (!doorData.active) continue;

			const neighborPos = room.getNeighborAtDirection(direction);
			if (!neighborPos) continue;

			const neighbor = this.getRoomByPosition(neighborPos.x, neighborPos.y);
			if (!neighbor) {
				doorData.active = false;
			} else {
				const oppositeDirection = room.getReverseDirection(direction);
				const neighborDoor = neighbor.doors[oppositeDirection];
				if (!neighborDoor.active) {
					doorData.active = false;
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
		const startRoom = this._preset_room["Depart"];
		if (!startRoom) return 0; // Cela ne devrait pas se produire, mais c'est juste pour être sûr.

		// Calculer la distance par rapport à la salle de départ.
		const distanceToStart = Math.sqrt((x - startRoom.x) ** 2 + (y - startRoom.y) ** 2);
		console.log("distanceToStart", distanceToStart)

		// La distance maximale possible dans le donjon (diagonale)
		const maxDistance = Math.sqrt(this._size.width ** 2 + this._size.height ** 2);
		console.log("maxDistance", maxDistance)

		// Plus la salle est proche de la salle de départ, plus la probabilité est élevée.
		const proximityFactor = (maxDistance - distanceToStart) / maxDistance;
		console.log(proximityFactor * 100)

		return proximityFactor * 100;
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