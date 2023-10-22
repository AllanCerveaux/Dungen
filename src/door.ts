import { Vector2 } from "./Vector2";
import { DoorDirectionName, RoomType } from "./type";

export class Door {
	private _position: Vector2 = Vector2.ZERO
	private _active: boolean = false


	constructor(public direction: DoorDirectionName) {
		switch (this.direction) {
			case 'NORTH':
				this._position = new Vector2(0, -1)
				break;
			case 'EAST':
				this._position = new Vector2(1, 0)
				break;
			case 'WEST':
				this._position = new Vector2(-1, 0)
				break;
			case 'SOUTH':
				this._position = new Vector2(0, 1)
				break;
			default:
				break
		}
	}

	activate(): void {
		this._active = true
	}

	desactivate(): void {
		this._active = false
	}

	get isActive(): boolean {
		return this._active
	}

	get position(): Vector2 {
		return this._position
	}

	get x(): number {
		return this._position.x
	}

	get y(): number {
		return this._position.y
	}
}