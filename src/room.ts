import { DoorDirection, DoorDirectionName, DoorDirectionValue, RoomNeighborPos, RoomType, Vector2 } from "./type";
import { DUNGEON_MAX_SIZE, getRandomInt } from "./utils";

export class Room {
	private _position: Vector2 = {
		x: 0,
		y: 0,
	};
	private _type: RoomType | null = null;
	private _doors: DoorDirection = {
		NORTH: {
			position: {
				x: 0,
				y: -1,
			},
			active: false,
			can_place: true
		},
		SOUTH: {
			position: {
				x: 0,
				y: 1,
			},
			active: false,
			can_place: true
		},
		EAST: {
			position: {
				x: 1,
				y: 0,
			},
			active: false,
			can_place: true
		},
		WEST: {
			position: {
				x: -1,
				y: 0,
			},
			active: false,
			can_place: true
		},
	};

	constructor(position: Vector2, type: RoomType) {
		this._position = position;
		this._type = type;
	}

	generateDoor(): void {
		this.disableDoor()
		const desiredDoorCount = getRandomInt(1, 5);
		const potentialDirections = [...this.doors_inactive];

		for (let i = 0; i < desiredDoorCount && potentialDirections.length > 0; i++) {
			const randomIndex = getRandomInt(0, potentialDirections.length);
			const [direction] = potentialDirections[randomIndex];

			if (this._doors[direction].can_place) {
				this.activateDoor(direction);
			}

			potentialDirections.splice(randomIndex, 1);
		}
	}

	link(direction: DoorDirectionName): void {
		this.activateDoor(this.getReverseDirection(direction))
	}

	activateDoor(direction: DoorDirectionName): void {
		this._doors = {
			...this._doors,
			[direction]: {
				...this._doors[direction],
				active: true,
			},
		};
	}

	getNeighborPos(): RoomNeighborPos[] {
		return this.doors_active.map(([direction, { position }]) => ({
			direction: direction,
			x: this.x + position.x,
			y: this.y + position.y
		}))
	}

	getDoor(x: number, y: number): [DoorDirectionName, DoorDirectionValue] | undefined {
		return this.doors_entries.find(([_, { position }]) => position.x === x && position.y === y)
	}

	getReverseDirection(direction: DoorDirectionName): DoorDirectionName {
		if (direction === "NORTH") return "SOUTH"
		else if (direction === "SOUTH") return "NORTH"
		else if (direction === "EAST") return "WEST"
		else if (direction === "WEST") return "EAST"
		else return direction
	}

	disableDoor(): void {
		this.doors_entries.forEach(([direction, { position }]) => {
			if (!this.doorCanBePlaced(position)) {
				this.doors[direction].can_place = false
			}
		})
	}

	doorCanBePlaced(position: Vector2): boolean {
		return this.x + position.x >= 0 &&
			this.x + position.x <= DUNGEON_MAX_SIZE.width &&
			this.y + position.y >= 0 &&
			this.y + position.y <= DUNGEON_MAX_SIZE.height;
	}

	get type(): RoomType | null {
		return this._type
	}

	get doors(): DoorDirection {
		return this._doors;
	}

	get doors_active() {
		return this.doors_entries.filter(([_, { active }]) => active);
	}

	get doors_inactive() {
		return this.doors_entries.filter(([_, { active, can_place }]) => !active && can_place);
	}

	get x(): number {
		return this._position.x;
	}

	get y(): number {
		return this._position.y;
	}

	get doors_entries(): Array<[DoorDirectionName, DoorDirectionValue]> {
		return Object.entries(this._doors) as Array<[DoorDirectionName, DoorDirectionValue]>
	}

	draw(): string {
		const {
			NORTH: { active: N },
			SOUTH: { active: S },
			EAST: { active: E },
			WEST: { active: W }
		} = this.doors

		const DN = N ? "N" : ""
		const DS = S ? "S" : ""
		const DE = E ? "E" : ""
		const DW = W ? "W" : ""
		const CR = this._type?.charAt(0)
		return `[${this.x}-${this.y}${CR}(${DW}${DN}${DS}${DE})]`
	}

	html(): HTMLDivElement {
		const {
			NORTH: { active: N },
			SOUTH: { active: S },
			EAST: { active: E },
			WEST: { active: W }
		} = this.doors
		const room = document.createElement('div')
		const classes = [
			'room'
		]
		if (this.type === 'Depart') classes.push('start')
		room.classList.add(...classes)
		room.innerHTML = `
<div>
	<span>◤</span>
	<span>${N ? "🚪" : "⬛️"}</span>
	<span>◥</span>
</div>
<div>
	<span>${W ? "🚪" : "⬛️"}</span>
	<span>[${this.y}-${this.x}]<span>
	<span>${E ? "🚪" : "⬛️"}</span>
</div>
<div>
	<span>◣</span>
	<span>${S ? "🚪" : "⬛️"}</span>
	<span>◢</span>
</div>
		`
		return room
	}
}