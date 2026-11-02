import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';

const source = await readFile('dist/server/index.js', 'utf8');
const {default: worker} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const db = new DatabaseSync(':memory:');
db.exec((await readFile('drizzle/0000_rooms.sql', 'utf8')).replaceAll('--> statement-breakpoint', ''));
const env = {DB: {prepare(sql) { return {bind(...values) { const statement = db.prepare(sql); return {first: async () => statement.get(...values), all: async () => ({results: statement.all(...values)}), run: async () => ({meta: {changes: statement.run(...values).changes}})}; }}; }}};

async function request(path, body, method = 'POST') {
  const response = await worker.fetch(new Request(`https://game.example${path}`, {method, ...(body ? {headers: {'content-type':'application/json'}, body:JSON.stringify(body)} : {})}), env);
  return {status: response.status, data: await response.json()};
}
const config = {name:'Аня', mode:'words', goal:25, language:'ru', difficulty:'medium', text: Array(25).fill('скорость').join(' ') + '.'};
const created = await request('/api/room', {action:'create', ...config});
assert.equal(created.status, 200);
assert.equal(created.data.room.status, 'waiting');
const code = created.data.room.code;
const joined = await request('/api/room', {action:'join', code, name:'Бекзат'});
assert.equal(joined.status, 200);
assert.equal(joined.data.room.code, code);
assert.equal(joined.data.room.role, 'guest');
assert.equal(joined.data.room.text, config.text);
db.prepare('UPDATE rooms SET started_at = ? WHERE code = ?').run(Date.now() - 100, code);
const bad = await request(`/api/room/${code}/progress`, {token: created.data.token, prefix:'wrong', errors:0});
assert.equal(bad.status, 400);
const progress = await request(`/api/room/${code}/progress`, {token: created.data.token, prefix:config.text.slice(0, 30), errors:1});
assert.equal(progress.status, 200);
const seen = await request(`/api/room/${code}/state?token=${joined.data.token}`, null, 'GET');
assert.equal(seen.data.room.hostProgress, 30);
const finished = await request(`/api/room/${code}/progress`, {token: created.data.token, prefix:config.text, errors:1});
assert.equal(finished.data.room.status, 'finished');
assert.equal(finished.data.room.winner, 'host');

const quickA = await request('/api/room', {action:'quick', ...config});
const quickB = await request('/api/room', {action:'quick', ...config, name:'Ержан'});
assert.equal(quickA.data.room.code, quickB.data.room.code);
assert.equal(quickB.data.room.status, 'running');

const timed = await request('/api/room', {action:'create', ...config, mode:'time', goal:30});
await request('/api/room', {action:'join', code:timed.data.room.code, name:'Друг'});
db.prepare('UPDATE rooms SET started_at = ?, host_progress = 40, guest_progress = 20 WHERE code = ?').run(Date.now() - 31000, timed.data.room.code);
const timedResult = await request(`/api/room/${timed.data.room.code}/state?token=${timed.data.token}`, null, 'GET');
assert.equal(timedResult.data.room.status, 'finished');
assert.equal(timedResult.data.room.winner, 'host');

const page = await worker.fetch(new Request('https://game.example/'), env);
assert.equal(page.status, 200);
assert.match(await page.text(), /ГОНКА С ДРУГОМ ИЛИ ОНЛАЙН/);
console.log('Room flow, matchmaking, race results and page serving passed');
