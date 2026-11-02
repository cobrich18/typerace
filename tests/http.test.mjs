import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

const port = 18000 + Math.floor(Math.random() * 1000);
const server = spawn(process.execPath, ['server.mjs'], {env: {...process.env, PORT: String(port)}, stdio: ['ignore', 'pipe', 'pipe']});
const base = `http://127.0.0.1:${port}`;

try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (server.exitCode !== null) throw new Error(`Server exited: ${server.exitCode}`);
    try { const response = await fetch(base); if (response.ok) {ready = true; break;} } catch (_) {}
  }
  assert.ok(ready, 'Server did not become ready');
  const page = await fetch(base);
  assert.match(await page.text(), /TYPE.*RACE/);
  const text = Array(25).fill('скорость').join(' ') + '.';
  const create = await fetch(`${base}/api/room`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({action:'create',name:'Проверка',mode:'words',goal:25,language:'ru',difficulty:'easy',text})});
  assert.equal(create.status, 200);
  const created = await create.json();
  const join = await fetch(`${base}/api/room`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({action:'join',name:'Друг',code:created.room.code})});
  assert.equal(join.status, 200);
  const joined = await join.json();
  assert.equal(joined.room.guestName, 'Друг');
  console.log('Render HTTP server and shared room flow passed');
} finally {
  server.kill('SIGTERM');
}
