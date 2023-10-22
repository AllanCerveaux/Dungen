import { Vector2 } from "./Vector2";

export type DoorDirectionName = "NORTH" | "SOUTH" | "EAST" | "WEST";
export type DoorDirectionValue = {
	position: Vector2;
	active: boolean;
	can_place: boolean
}
export type DoorDirection = Record<
	DoorDirectionName,
	DoorDirectionValue
>;
export type RoomNeighborPos = {
	direction: DoorDirectionName,
	x: Vector2['x'],
	y: Vector2['y']
}
export type RoomType = "start" | "end" | "normal";
