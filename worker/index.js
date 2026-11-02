const ASSETS = __ASSETS__;
const headers = {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'};
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const allowedGoals = {words: [25, 50, 100, 200], time: [30, 60, 120], free: [0]};

function json(data, status = 200) { return new Response(JSON.stringify(data), {status, headers}); }
function fail(message, status = 400) { return json({error: message}, status); }
function code() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join('');
}
function cleanName(value) { return String(value || 'Гонщик').replace(/[\x00-\x1f<>]/g, '').trim().slice(0, 20) || 'Гонщик'; }
function validConfig(data) {
  return ['ru','en','kz'].includes(data.language) && ['easy','medium','hard'].includes(data.difficulty) && Object.hasOwn(allowedGoals, data.mode) && allowedGoals[data.mode].includes(Number(data.goal)) && typeof data.text === 'string' && data.text.length >= 100 && data.text.length <= 10000 && !/[ёЁ]/.test(data.text);
}
function roleFor(room, token) { return token === room.host_id ? 'host' : token === room.guest_id ? 'guest' : null; }
function publicRoom(room, token) {
  return {code: room.code, kind: room.kind, status: room.status, mode: room.mode, goal: room.goal, language: room.language, difficulty: room.difficulty, text: room.text, hostName: room.host_name, guestName: room.guest_name, hostProgress: room.host_progress, guestProgress: room.guest_progress, hostErrors: room.host_errors, guestErrors: room.guest_errors, startedAt: room.started_at, winner: room.winner, role: roleFor(room, token), serverNow: Date.now()};
}
async function getRoom(db, roomCode) { return db.prepare('SELECT * FROM rooms WHERE code = ?').bind(roomCode).first(); }
async function settleTimedRoom(db, room) {
  if (room.status !== 'running' || room.mode !== 'time' || Date.now() < room.started_at + room.goal * 1000) return room;
  const winner = room.host_progress === room.guest_progress ? 'tie' : room.host_progress > room.guest_progress ? 'host' : 'guest';
  await db.prepare("UPDATE rooms SET status = 'finished', winner = ?, updated_at = ? WHERE code = ? AND status = 'running'").bind(winner, Date.now(), room.code).run();
  return getRoom(db, room.code);
}
async function createRoom(db, data, kind) {
  if (!validConfig(data)) return fail('Неверные настройки заезда.');
  const token = crypto.randomUUID();
  const name = cleanName(data.name);
  const now = Date.now();
  for (let i = 0; i < 5; i++) {
    const roomCode = code();
    const result = await db.prepare('INSERT OR IGNORE INTO rooms (code, kind, mode, goal, language, difficulty, text, status, host_id, host_name, created_at, updated_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(roomCode, kind, data.mode, Number(data.goal), data.language, data.difficulty, data.text, 'waiting', token, name, now, now, now + 10 * 60 * 1000).run();
    if (result.meta?.changes) return json({room: publicRoom(await getRoom(db, roomCode), token), token});
  }
  return fail('Не удалось создать комнату. Попробуй снова.', 503);
}
async function joinRoom(db, roomCode, name) {
  if (!/^[A-Z2-9]{6}$/.test(roomCode)) return fail('Проверь код комнаты.');
  const room = await getRoom(db, roomCode);
  if (!room || room.status !== 'waiting' || room.guest_id || room.expires_at < Date.now()) return fail('Комната не найдена или заезд уже начался.', 404);
  const token = crypto.randomUUID();
  const now = Date.now();
  const result = await db.prepare("UPDATE rooms SET guest_id = ?, guest_name = ?, status = 'running', started_at = ?, updated_at = ?, expires_at = ? WHERE code = ? AND status = 'waiting' AND guest_id IS NULL").bind(token, cleanName(name), now + 4000, now, now + 30 * 60 * 1000, roomCode).run();
  if (!result.meta?.changes) return fail('Соперник уже занял место. Попробуй другой заезд.', 409);
  return json({room: publicRoom(await getRoom(db, roomCode), token), token});
}
async function handleCreate(request, db) {
  const data = await request.json();
  if (data.action === 'join') return joinRoom(db, String(data.code || '').toUpperCase(), data.name);
  if (data.action === 'create') return createRoom(db, data, 'private');
  if (data.action === 'quick') {
    if (!validConfig(data)) return fail('Неверные настройки заезда.');
    const candidates = await db.prepare("SELECT code FROM rooms WHERE kind = 'public' AND status = 'waiting' AND guest_id IS NULL AND language = ? AND mode = ? AND goal = ? AND difficulty = ? AND expires_at > ? ORDER BY created_at LIMIT 5").bind(data.language, data.mode, Number(data.goal), data.difficulty, Date.now()).all();
    for (const candidate of candidates.results || []) {
      const joined = await joinRoom(db, candidate.code, data.name);
      if (joined.status === 200) return joined;
    }
    return createRoom(db, data, 'public');
  }
  return fail('Неизвестное действие.');
}
async function handleRoom(request, db, roomCode, operation) {
  const data = request.method === 'GET' ? Object.fromEntries(new URL(request.url).searchParams) : await request.json();
  const token = String(data.token || '');
  let room = await getRoom(db, roomCode);
  if (!room || !roleFor(room, token)) return fail('Комната недоступна.', 404);
  if (room.status === 'waiting' && room.expires_at < Date.now()) {
    await db.prepare("UPDATE rooms SET status = 'finished', winner = 'tie' WHERE code = ? AND status = 'waiting'").bind(roomCode).run();
    room = await getRoom(db, roomCode);
  }
  room = await settleTimedRoom(db, room);
  if (operation === 'state' && request.method === 'GET') return json({room: publicRoom(room, token)});
  if (operation === 'progress' && request.method === 'POST') {
    if (room.status !== 'running' || Date.now() < room.started_at) return fail('Заезд еще не начался или уже завершен.', 409);
    const prefix = String(data.prefix || '');
    if (!room.text.startsWith(prefix)) return fail('Текст не совпадает с заездом.');
    const role = roleFor(room, token);
    const progressColumn = role === 'host' ? 'host_progress' : 'guest_progress';
    const errorsColumn = role === 'host' ? 'host_errors' : 'guest_errors';
    const errors = Math.min(9999, Math.max(0, Number(data.errors) || 0));
    await db.prepare(`UPDATE rooms SET ${progressColumn} = MAX(${progressColumn}, ?), ${errorsColumn} = MAX(${errorsColumn}, ?), updated_at = ? WHERE code = ? AND status = 'running'`).bind(prefix.length, errors, Date.now(), roomCode).run();
    if (room.mode === 'words' && prefix.length === room.text.length) {
      await db.prepare("UPDATE rooms SET status = 'finished', winner = ?, updated_at = ? WHERE code = ? AND status = 'running'").bind(role, Date.now(), roomCode).run();
    }
    return json({room: publicRoom(await getRoom(db, roomCode), token)});
  }
  if (operation === 'finish' && request.method === 'POST') {
    if (room.status === 'finished') return json({room: publicRoom(room, token)});
    const role = roleFor(room, token);
    const winner = room.status === 'waiting' ? 'tie' : room.mode === 'free' ? (room.host_progress === room.guest_progress ? 'tie' : room.host_progress > room.guest_progress ? 'host' : 'guest') : role === 'host' ? 'guest' : 'host';
    await db.prepare("UPDATE rooms SET status = 'finished', winner = ?, updated_at = ? WHERE code = ? AND status != 'finished'").bind(winner, Date.now(), roomCode).run();
    return json({room: publicRoom(await getRoom(db, roomCode), token)});
  }
  return fail('Маршрут не найден.', 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'GET' && (path === '/' || path === '/index.html')) return new Response(ASSETS.html, {headers: {'content-type':'text/html; charset=utf-8'}});
    if (request.method === 'GET' && path === '/styles.css') return new Response(ASSETS.css, {headers: {'content-type':'text/css; charset=utf-8'}});
    if (request.method === 'GET' && path === '/app.js') return new Response(ASSETS.js, {headers: {'content-type':'text/javascript; charset=utf-8'}});
    if (!path.startsWith('/api/')) return new Response('Not found', {status: 404});
    if (!env.DB) return fail('Онлайн режим временно недоступен.', 503);
    try {
      if (path === '/api/room' && request.method === 'POST') return await handleCreate(request, env.DB);
      const match = path.match(/^\/api\/room\/([A-Z2-9]{6})\/(state|progress|finish)$/);
      if (match) return await handleRoom(request, env.DB, match[1], match[2]);
      return fail('Маршрут не найден.', 404);
    } catch (error) {
      console.error('Room API failed', error);
      return fail('Не удалось обработать запрос. Попробуй снова.', 500);
    }
  }
};
