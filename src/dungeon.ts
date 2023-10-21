import { Room } from "./room";
import { RoomType } from "./type";
import { create2DArray } from "./utils";

export class Dungeon {
	private _size = {
		width: 8,
		height: 8,
	};
	private _preset_room: Record<"Start" | "End", Room | null> = {
		Start: null,
		End: null,
	};
	grid: (Room | null)[][] = [];

	generate() {
		this.generateDungeon();
		this.generateRooms();
	}

	generateDungeon() {
		this.grid = create2DArray(this._size.width, this._size.height, null);
	}

	generateRooms() {
		this.addRoom(Math.floor(this._size.width / 2), Math.floor(this._size.height / 2), 'Depart');
		this._preset_room.Start = this.getRoomByPosition(Math.floor(this._size.width / 2), Math.floor(this._size.height / 2));

		let current_room: Room | null | undefined = this._preset_room.Start;
		let stack = [current_room];

		while (stack.length) {
			current_room = stack.pop();
			if (!current_room) return
			const neighbors = current_room.getNeighborPos();

			for (const neighbor of neighbors) {
				if (!this.isValidPosition(neighbor.x, neighbor.y) || this.getRoomByPosition(neighbor.x, neighbor.y)) {
					continue; // Skip if position is invalid or room already exists
				}

				const newRoom = this.addRoom(neighbor.x, neighbor.y);
				newRoom.link(neighbor.direction);
				current_room.link(current_room.getReverseDirection(neighbor.direction)); // Link the current room in the opposite direction
				stack.push(newRoom);
			}
		}
	}

	isValidPosition(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this._size.width && y < this._size.height;
	}

	getRoomByPosition(x: number, y: number): Room | null {
		return this.grid[y][x]
	}

	addRoom(x: number, y: number, type: RoomType = 'Normal') {
		const newRoom = new Room({ x, y }, type);
		this.grid[y][x] = newRoom;
		newRoom.generateDoor()

		return newRoom;
	}

	draw() {
		for (const row of this.grid) {
			const x = this.grid.indexOf(row)
			const col = row.map((room, y) => {
				if (!room) return `X${y}-${x}`
				return room.draw()
			})
			console.log(col.join(''))
		}
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