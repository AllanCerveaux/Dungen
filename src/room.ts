import { Vector2 } from "./Vector2";
import { Door } from "./door";
import { DoorDirectionName, RoomNeighborPos, RoomType } from "./type";
import { DUNGEON_MAX_SIZE, getRandomInt } from "./utils";


export class Room {
	private _doors: Door[] = [];

	constructor(
		public position: Vector2,
		public type: RoomType
	) { }

	generateDoor() {
		const desiredDoorCount = getRandomInt(1, 5);
		const potentialDirections: DoorDirectionName[] = ["NORTH", "EAST", "WEST", "SOUTH"];
		let generatedDoors = 0;

		while (generatedDoors < desiredDoorCount && potentialDirections.length > 0) {
			const randomIndex = getRandomInt(0, potentialDirections.length);
			const direction = potentialDirections[randomIndex];
			const door = new Door(direction);

			if (!this.doorCanBePlaced(door.position) || this.getDoorByDirection(direction)) {
				potentialDirections.splice(randomIndex, 1);
				continue;
			}

			door.activate();
			this._doors.push(door);
			potentialDirections.splice(randomIndex, 1);
			generatedDoors++;
		}
	}

	getDoorByDirection(payload: DoorDirectionName): Door | undefined {
		return this._doors.find(({ direction }) => direction === payload)
	}

	getNeighborAtDirection(direction: DoorDirectionName): Vector2 | null {
		const door = this.getDoorByDirection(direction)
		if (!door) return null
		const x = this.x + door.x;
		const y = this.y + door.y;

		return new Vector2(x, y)
	}

	getNeighborPos(): RoomNeighborPos[] {
		return this._doors.map(({ direction, position }) => ({
			direction: this.getOppositeDirection(direction),
			x: this.x + position.x,
			y: this.y + position.y
		}))
	}

	linkDoor(direction: DoorDirectionName): void {
		const door = this.getDoorByDirection(direction)
		if (!door) {
			const linkedDoor = new Door(direction)
			linkedDoor.activate()
			this._doors.push(linkedDoor)
		}
	}

	unlinkDoor(direction: DoorDirectionName): void {
		const door = this.getDoorByDirection(direction)
		if (door) {
			door.desactivate()
		}
	}

	getOppositeDirection(direction: DoorDirectionName): DoorDirectionName {
		if (direction === "NORTH") return "SOUTH"
		else if (direction === "SOUTH") return "NORTH"
		else if (direction === "EAST") return "WEST"
		else if (direction === "WEST") return "EAST"
		else return direction
	}

	private doorCanBePlaced(position: Vector2): boolean {
		return this.x + position.x >= 0 &&
			this.x + position.x < DUNGEON_MAX_SIZE.width &&
			this.y + position.y >= 0 &&
			this.y + position.y < DUNGEON_MAX_SIZE.height;
	}

	get doors(): Door[] {
		return this._doors
	}

	get doorCount(): number {
		return this._doors.length
	}

	get x(): number {
		return this.position.x
	}
	get y(): number {
		return this.position.y
	}

	html(): HTMLDivElement {
		const roomContainer = document.createElement('div')
		const classes = [
			'room'
		]
		if (this.type === 'start') classes.push('start')
		roomContainer.classList.add(...classes)

		const roomType = () => {
			if (this.type === 'start') return '🟩'
			else if (this.type === 'end') return '🟥'
			else return '⬜️'
		}

		roomContainer.innerHTML = `
		<div>
			<span>[${this.y}-${this.x}]<span>
		</div>
		<div>
			<span>◤</span>
			<span>${this.getDoorByDirection('NORTH')?.isActive ? "🚪" : "⬛️"}</span>
			<span>◥</span>
		</div>
		<div>
			<span>${this.getDoorByDirection('WEST')?.isActive ? "🚪" : "⬛️"}</span>
			<span>${roomType()}</span>
			<span>${this.getDoorByDirection('EAST')?.isActive ? "🚪" : "⬛️"}</span>
		</div>
		<div>
			<span>◣</span>
			<span>${this.getDoorByDirection('SOUTH')?.isActive ? "🚪" : "⬛️"}</span>
			<span>◢</span>
		</div>
				`

		return roomContainer
	}
}