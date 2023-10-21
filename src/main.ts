import { Dungeon } from './dungeon';
import { Room } from './room';
import './style.css';

const dungeon = new Dungeon()
dungeon.generate()
dungeon.drawHTML()

const app = (document.getElementById('app') as HTMLDivElement)
app.innerHTML += `<h1>Dungen</h1>`