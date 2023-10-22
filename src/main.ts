import { Dungeon } from './dungeon';
import './style.css';

const app = (document.getElementById('app') as HTMLDivElement)
app.innerHTML += `<h1>Dungen</h1>`

const dungeon = new Dungeon()
dungeon.generate()
console.log(dungeon)

app.appendChild(dungeon.html())
