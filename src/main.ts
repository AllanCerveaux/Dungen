import { Vector2 } from './Vector2';
import { Dungeon } from './dungeon';
import { Room } from './room';
import './style.css';

const app = (document.getElementById('app') as HTMLDivElement)
app.innerHTML += `<h1>Dungen</h1>`

const dungeon = new Dungeon()
dungeon.generate()
console.log(dungeon)

app.appendChild(dungeon.html())

const room = new Room(Vector2.ZERO, 'start')
room.generateDoor()
console.log(room)

app.appendChild(room.html())