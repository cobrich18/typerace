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
assert.equal(joined.data.room.status, 'ready');
const guestStart = await request(`/api/room/${code}/start`, {token:joined.data.token});
assert.equal(guestStart.status, 403);
const guestFinish = await request(`/api/room/${code}/finish`, {token:joined.data.token});
assert.equal(guestFinish.status, 403);
const started = await request(`/api/room/${code}/start`, {token:created.data.token});
assert.equal(started.status, 200);
assert.equal(started.data.room.status, 'running');
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
assert.equal(quickB.data.room.status, 'ready');

const leave = await request(`/api/room/${quickA.data.room.code}/leave`, {token:quickB.data.token});
assert.equal(leave.status, 200);
const waitingAgain = await request(`/api/room/${quickA.data.room.code}/state?token=${quickA.data.token}`, null, 'GET');
assert.equal(waitingAgain.data.room.status, 'waiting');

const timed = await request('/api/room', {action:'create', ...config, mode:'time', goal:30});
const timedGuest = await request('/api/room', {action:'join', code:timed.data.room.code, name:'Друг'});
await request(`/api/room/${timed.data.room.code}/start`, {token:timed.data.token});
db.prepare('UPDATE rooms SET started_at = ?, host_progress = 40, guest_progress = 20 WHERE code = ?').run(Date.now() - 31000, timed.data.room.code);
const timedResult = await request(`/api/room/${timed.data.room.code}/state?token=${timed.data.token}`, null, 'GET');
assert.equal(timedResult.data.room.status, 'finished');
assert.equal(timedResult.data.room.winner, 'host');

const free = await request('/api/room', {action:'create', ...config, mode:'free', goal:0});
const freeGuest = await request('/api/room', {action:'join', code:free.data.room.code, name:'Друг'});
await request(`/api/room/${free.data.room.code}/start`, {token:free.data.token});
db.prepare('UPDATE rooms SET started_at = ? WHERE code = ?').run(Date.now() - 100, free.data.room.code);
const freeDone = await request(`/api/room/${free.data.room.code}/progress`, {token:freeGuest.data.token, prefix:config.text, errors:0});
assert.equal(freeDone.data.room.status, 'finished');
assert.equal(freeDone.data.room.winner, 'guest');

const manual = await request('/api/room', {action:'create', ...config, mode:'free', goal:0});
await request('/api/room', {action:'join', code:manual.data.room.code, name:'Друг'});
await request(`/api/room/${manual.data.room.code}/start`, {token:manual.data.token});
db.prepare('UPDATE rooms SET host_progress = 30, guest_progress = 20 WHERE code = ?').run(manual.data.room.code);
const stopped = await request(`/api/room/${manual.data.room.code}/finish`, {token:manual.data.token});
assert.equal(stopped.data.room.status, 'finished');
assert.equal(stopped.data.room.winner, 'host');

const page = await worker.fetch(new Request('https://game.example/'), env);
assert.equal(page.status, 200);
assert.match(await page.text(), /Гонка с другом/);
console.log('Room flow, matchmaking, race results and page serving passed');
