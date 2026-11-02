const texts = {
  ru: [
    'Скорость приходит с практикой. Держи взгляд на дороге, чувствуй ритм клавиш и не позволяй ошибкам сбить тебя с пути.',
    'Ночной город мелькает за окном. До финиша осталось совсем немного, а впереди еще один поворот и шанс вырваться вперед.',
    'Каждая секунда имеет значение. Печатай уверенно, сохраняй спокойствие и набирай скорость на последнем участке трассы.',
    'На старте все равны. Побеждает тот, кто умеет держать темп, быстро исправлять ошибки и не сдаваться до самого финиша.',
    'Дождь стучит по стеклу, огни отражаются на мокром асфальте. Машина набирает ход, пока пальцы танцуют по клавиатуре.',
    'Когда мотор ревет и дорога зовет вперед, остается только одно: собраться, поймать ритм и пройти дистанцию без ошибок.',
    'На длинной трассе важна не только скорость. Ровный темп помогает сохранить силы и уверенно пройти каждый новый участок.',
    'Светофор меняет цвет, и машины выезжают на дорогу. Сегодня победит тот, кто будет внимателен к каждой букве.',
    'Хороший водитель смотрит далеко вперед. Хороший игрок читает следующую фразу, пока пальцы набирают текущую.',
    'Поворот уже позади. Теперь можно ускориться, но одно неверное движение напомнит, что точность важнее спешки.',
    'Трасса кажется бесконечной, пока не поймаешь ритм. Тогда каждый новый километр становится проще предыдущего.',
    'Финишная черта приближается. Сохраняй спокойствие, не смотри на соперника и печатай так, как умеешь лучше всего.'
  ],
  en: [
    'Speed comes with practice. Keep your eyes on the road, find the rhythm of the keys and do not let mistakes slow you down.',
    'The city lights flash past the window. The finish line is close, but one last turn could change the whole race.',
    'Every second counts. Type with confidence, stay calm and build your speed on the final stretch of the track.',
    'Everyone starts together. The winner keeps a steady pace, learns from mistakes and never gives up before the finish.',
    'Rain taps against the glass as the road glows under the streetlights. Your fingers move faster and the car picks up speed.',
    'The engine hums and the open road calls. Take a breath, find your rhythm and race all the way to the finish.',
    'A long race rewards patience as much as speed. A steady pace helps you stay focused through every new stretch of road.',
    'The traffic light changes color and the cars roll forward. The driver who watches every letter will take the lead.',
    'A good driver looks far ahead. A good typist reads the next phrase while their fingers finish the current one.',
    'The turn is behind you now. You can speed up, but a single mistake may remind you that accuracy matters.',
    'The road feels endless until you find a rhythm. Then every new mile becomes a little easier than the last.',
    'The finish line is getting closer. Stay calm, ignore the other car and type at the pace you know best.'
  ],
  kz: [
    'Жылдамдық жаттығумен келеді. Жолға назар аудар, пернелердің ырғағын тап және қателікке жол берме.',
    'Қала шамдары терезе сыртында жарқырайды. Мәре жақын қалды, ал соңғы бұрылыс жарыстың тағдырын шешеді.',
    'Әр секунд маңызды. Сабыр сақта, мәтінді мұқият тер және жолдың соңғы бөлігінде жылдамдықты арттыр.',
    'Бәрі бірдей бастайды. Жеңіске жету үшін тұрақты қарқын ұста, қателікті түзет және мәреге дейін тоқтама.',
    'Жаңбыр әйнекке тырсылдайды, көше шамдары жолға шағылысады. Саусақтарың пернелерді басқан сайын көлік жүйткиді.',
    'Алда ашық жол жатыр. Терең тыныс ал, өз ырғағыңды тап және мәреге сенімді түрде жет.',
    'Ұзақ жарыста жылдамдықпен бірге шыдам да керек. Бірқалыпты қарқын әр жаңа кезеңде ойыңды жинақтауға көмектеседі.',
    'Бағдаршам түсін өзгертті, көліктер алға жылжыды. Әр әріпке мұқият қараған жүргізуші озады.',
    'Жақсы жүргізуші алдағы жолды байқайды. Жақсы ойыншы келесі сөйлемді алдын ала оқып отырады.',
    'Бұрылыс артта қалды. Енді жылдамдықты арттыр, бірақ дәлдікті ұмытпа және асығыс қателік жасама.',
    'Өз ырғағыңды тапсаң, ұзақ жол да жеңіл көрінеді. Әр жаңа шақырым саған сенім береді.',
    'Мәре сызығы жақындап келеді. Сабыр сақта, қарсыласқа алаңдама және мәтінді анық тер.'
  ]
};
const languageNames = {ru: 'RU', en: 'ENG', kz: 'KAZ'};
const layoutHints = {ru: 'Раскладка RU · правильные символы двигают тебя вперед', en: 'Раскладка ENG · правильные символы двигают тебя вперед', kz: 'Раскладка KAZ · используй казахскую кириллическую клавиатуру'};

const $ = id => document.getElementById(id);
const el = Object.fromEntries(['raceNumber','raceStatus','track','rivalPercent','playerPercent','rivalCar','playerCar','rivalName','countdown','wpm','accuracy','mistakes','timer','prompt','typeInput','inputWrap','typingHint','typedCount','totalCount','startButton','newTextButton','finishButton','language','languageLabel','difficulty','difficultyLabel','bestScore','soundButton','goal','goalLabel','modeHint','remaining','playerName','roomCode','createRoomButton','quickMatchButton','joinRoomButton','roomPanel','roomStatus','roomDetails','copyRoomButton','leaveRoomButton','onlineMessage','resultBackdrop','resultKicker','resultIcon','resultTitle','resultText','resultWpm','resultAccuracy','resultTime','againButton','closeResultButton'].map(id => [id, $(id)]));
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const speeds = {easy: 33, medium: 48, hard: 65};
const labels = {easy: 'ЛЕГКИЙ', medium: 'СРЕДНИЙ', hard: 'СЛОЖНЫЙ'};
const state = {phase: 'ready', mode: 'words', goal: 50, text: '', index: -1, textLanguage: null, correct: 0, errors: 0, startAt: 0, elapsed: 0, rival: 0, freezeUntil: 0, frame: 0, countdownTimer: null, raceNumber: 0, sound: false};
const online = {code: null, token: null, role: null, room: null, pollTimer: null, syncTimer: null, busy: false, connecting: false, clockOffset: 0};
let audioContext;

function buildText(language, wordCount) {
  const pool = texts[language];
  const words = [];
  let previous = -1;
  while (words.length < wordCount) {
    let index = Math.floor(Math.random() * pool.length);
    while (index === previous) index = Math.floor(Math.random() * pool.length);
    words.push(...pool[index].split(/\s+/));
    previous = index;
  }
  words.length = wordCount;
  words[wordCount - 1] = words[wordCount - 1].replace(/[,;:.!?]+$/, '') + '.';
  return words.join(' ');
}

function playerProgress() {
  if (state.mode === 'words') return state.correct / state.text.length;
  if (state.mode === 'time') return Math.min(1, state.correct / (state.goal * speeds[el.difficulty.value] * 5 / 60));
  return Math.min(1, state.correct / state.text.length);
}

function updateRemaining() {
  if (state.mode === 'time') {
    el.remaining.textContent = `${Math.max(0, Math.ceil(state.goal - state.elapsed / 1000))} сек осталось`;
  } else if (state.mode === 'words') {
    const prefix = state.text.slice(0, state.correct);
    const completed = state.correct === state.text.length ? state.goal : prefix.split(/\s+/).length - 1;
    el.remaining.textContent = `${Math.max(0, state.goal - completed)} слов осталось`;
  } else {
    const completed = state.correct === state.text.length ? 1200 : state.text.slice(0, state.correct).split(/\s+/).length - 1;
    el.remaining.textContent = `${Math.max(0, completed)} / 1200 слов`;
  }
}

function setMode(mode) {
  if (state.phase === 'running' || state.phase === 'countdown') return;
  state.mode = mode;
  for (const button of modeButtons) {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  el.goalLabel.firstChild.textContent = mode === 'time' ? 'ЛИМИТ ' : 'ДИСТАНЦИЯ ';
  el.goal.hidden = mode === 'free';
  el.goalLabel.hidden = mode === 'free';
  el.goal.innerHTML = mode === 'time' ? '<option value="30">30 секунд</option><option value="60" selected>60 секунд</option><option value="120">120 секунд</option>' : '<option value="25">25 слов</option><option value="50" selected>50 слов</option><option value="100">100 слов</option><option value="200">200 слов</option>';
  el.modeHint.textContent = mode === 'time' ? 'Финиш по таймеру: больше верных символов побеждает. Весь текст — досрочный финиш.' : mode === 'words' ? 'Финиш: первый, кто напечатает все слова.' : 'Создатель завершает вручную, побеждает тот, кто впереди. Лимит — 1200 слов.';
  prepareText();
}

async function api(path, options = {}) {
  const response = await fetch(path, {cache: 'no-store', ...options});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Не удалось связаться с сервером.');
  return data;
}

function onlineMessage(message, error = false) {
  el.onlineMessage.textContent = message;
  el.onlineMessage.classList.toggle('error', error);
}

function lockOnlineSettings(locked) {
  for (const control of [el.language, el.difficulty, el.goal, el.startButton, el.newTextButton, el.createRoomButton, el.quickMatchButton, el.joinRoomButton, ...modeButtons]) control.disabled = locked;
}

function showConnecting() {
  state.phase = 'connecting';
  lockOnlineSettings(true);
  el.startButton.querySelector('span').textContent = 'ПОДКЛЮЧЕНИЕ...';
  el.typingHint.textContent = 'Подключаемся к онлайн-комнате';
  onlineMessage('Подключаемся к комнате...');
}

function clearOnline() {
  clearInterval(online.pollTimer); clearTimeout(online.syncTimer);
  if (online.code) { try { sessionStorage.removeItem(`typerace-room-${online.code}`); } catch (_) {} }
  online.code = null; online.token = null; online.role = null; online.room = null; online.pollTimer = null; online.connecting = false;
  el.roomPanel.hidden = true; el.countdown.hidden = true; el.rivalName.textContent = 'СОПЕРНИК';
  lockOnlineSettings(false);
  onlineMessage('');
}

function configureOnlineRoom(room) {
  setMode(room.mode);
  el.language.value = room.language; el.difficulty.value = room.difficulty;
  if (room.mode !== 'free') el.goal.value = String(room.goal);
  prepareText();
  state.mode = room.mode; state.goal = room.goal; state.text = room.text;
  el.languageLabel.textContent = languageNames[room.language];
  el.difficultyLabel.textContent = labels[room.difficulty];
  el.totalCount.textContent = room.text.length;
  state.phase = 'waiting';
  renderPrompt(); updateStats(); updateCars();
  lockOnlineSettings(true);
  el.roomPanel.hidden = false;
  el.roomDetails.textContent = `Код комнаты: ${room.code} · ${room.mode === 'words' ? room.goal + ' слов' : room.mode === 'time' ? room.goal + ' сек' : 'свободный'}`;
  el.roomCode.value = room.code;
}

function rivalProgress(room) {
  const characters = room.role === 'host' ? room.guestProgress : room.hostProgress;
  if (room.mode === 'words') return characters / room.text.length;
  if (room.mode === 'time') return Math.min(1, characters / (room.goal * speeds[room.difficulty] * 5 / 60));
  return Math.min(1, characters / room.text.length);
}

function applyOnlineRoom(room) {
  if (!online.code || room.code !== online.code) return;
  online.room = room;
  online.clockOffset = room.serverNow - Date.now();
  el.rivalName.textContent = (room.role === 'host' ? room.guestName : room.hostName) || 'СОПЕРНИК';
  state.rival = rivalProgress(room);
  updateCars();
  if (room.status === 'waiting') {
    el.roomStatus.textContent = 'Ожидание соперника';
    el.startButton.disabled = true;
    el.startButton.querySelector('span').textContent = 'ЖДЕМ СОПЕРНИКА';
    el.typingHint.textContent = 'Друг подключится по ссылке, затем создатель начнет заезд';
    setStatus('ЖДЕМ ВТОРОГО ИГРОКА');
    return;
  }
  if (room.status === 'ready') {
    el.roomStatus.textContent = `${el.rivalName.textContent} подключился · готов к старту`;
    el.startButton.disabled = room.role !== 'host';
    el.startButton.querySelector('span').textContent = room.role === 'host' ? 'НАЧАТЬ ОНЛАЙН-ЗАЕЗД' : 'ЖДЕМ СТАРТА СОЗДАТЕЛЯ';
    el.typingHint.textContent = room.role === 'host' ? 'Нажми кнопку под трассой, когда оба готовы' : 'Создатель комнаты запустит заезд';
    setStatus(room.role === 'host' ? 'СОПЕРНИК ГОТОВ' : 'ЖДЕМ СТАРТА');
    return;
  }
  if (room.status === 'running') {
    el.roomStatus.textContent = `Гонка с ${el.rivalName.textContent}`;
    el.startButton.disabled = true;
    el.startButton.querySelector('span').textContent = 'ОНЛАЙН-ЗАЕЗД';
    if (state.phase === 'waiting') { state.phase = 'countdown'; state.raceNumber++; el.raceNumber.textContent = `#${String(state.raceNumber).padStart(2, '0')}`; }
    if (state.phase === 'countdown') {
      const left = room.startedAt - (Date.now() + online.clockOffset);
      if (left > 0) { el.countdown.hidden = false; el.countdown.textContent = Math.ceil(left / 1000); setStatus('ПРИГОТОВЬСЯ'); }
      else { startRace(); state.startAt = performance.now() - Math.max(0, Date.now() + online.clockOffset - room.startedAt); }
    }
    return;
  }
  el.roomStatus.textContent = 'Заезд завершен';
  if (state.phase === 'waiting' || state.phase === 'countdown') { clearCountdown(); state.phase = 'running'; state.startAt = performance.now(); }
  if (state.phase === 'running') finish(room.winner === 'tie' ? 'tie' : room.winner === online.role ? 'won' : 'lost');
}

async function pollRoom() {
  if (!online.code || online.busy) return;
  online.busy = true;
  try {
    const {room} = await api(`/api/room/${online.code}/state?token=${encodeURIComponent(online.token)}`);
    applyOnlineRoom(room);
    if (room.status === 'running' && state.phase === 'running' && state.correct === state.text.length) scheduleProgress();
    onlineMessage('');
  } catch (error) { onlineMessage(error.message, true); }
  finally { online.busy = false; }
}

function activateOnline(room, token) {
  clearOnline();
  online.code = room.code; online.token = token; online.role = room.role;
  try { sessionStorage.setItem(`typerace-room-${room.code}`, token); } catch (_) {}
  configureOnlineRoom(room);
  applyOnlineRoom(room);
  online.pollTimer = setInterval(pollRoom, 450);
  const url = new URL(window.location.href); url.searchParams.set('room', room.code);
  history.replaceState(null, '', url);
}

async function enterOnline(action) {
  if (online.code || online.connecting) return;
  online.connecting = true;
  showConnecting();
  const name = el.playerName.value.trim() || 'Гонщик';
  try {
    try { localStorage.setItem('typerace-player-name', name); } catch (_) { /* Name is optional session data. */ }
    const data = action === 'join' ? {action, name, code: el.roomCode.value.trim().toUpperCase()} : {action, name, mode: state.mode, goal: state.goal, language: el.language.value, difficulty: el.difficulty.value, text: state.text};
    const result = await api('/api/room', {method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(data)});
    activateOnline(result.room, result.token);
    onlineMessage(result.room.status === 'waiting' ? 'Поделись ссылкой с другом или жди соперника.' : 'Соперник найден. Создатель комнаты может начать заезд.');
  } catch (error) {
    onlineMessage(error.message, true);
    online.connecting = false;
    state.phase = 'ready';
    lockOnlineSettings(false);
    el.startButton.querySelector('span').textContent = 'НАЧАТЬ ЗАЕЗД';
    el.typingHint.textContent = layoutHints[el.language.value];
  }
}

function scheduleProgress() {
  if (!online.code || state.phase !== 'running') return;
  clearTimeout(online.syncTimer);
  online.syncTimer = setTimeout(async () => {
    try {
      const {room} = await api(`/api/room/${online.code}/progress`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({token:online.token, prefix:state.text.slice(0,state.correct), errors:state.errors})});
      applyOnlineRoom(room);
    } catch (error) { onlineMessage(error.message, true); }
  }, 90);
}

async function stopOnline() {
  if (!online.code) return;
  if (online.role !== 'host') return;
  try {
    const {room} = await api(`/api/room/${online.code}/finish`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({token:online.token})});
    applyOnlineRoom(room);
  } catch (error) { onlineMessage(error.message, true); }
}

async function startOnline() {
  if (!online.code || online.role !== 'host' || online.room?.status !== 'ready') return;
  el.startButton.disabled = true;
  onlineMessage('Запускаем заезд...');
  try {
    const {room} = await api(`/api/room/${online.code}/start`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({token:online.token})});
    applyOnlineRoom(room);
  } catch (error) {
    onlineMessage(error.message, true);
    if (online.room?.status === 'ready') el.startButton.disabled = false;
  }
}

function sound(freq, duration = .08, type = 'sine') {
  if (!state.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(); osc.stop(audioContext.currentTime + duration);
  } catch (_) { /* Sound is optional. */ }
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderPrompt() {
  const start = Math.max(0, state.correct - 65);
  const end = Math.min(state.text.length, state.correct + 300);
  const before = (start ? '… ' : '') + escapeHTML(state.text.slice(start, state.correct));
  const current = state.correct < state.text.length ? `<span class="current">${escapeHTML(state.text[state.correct])}</span>` : '';
  const after = escapeHTML(state.text.slice(state.correct + 1, end)) + (end < state.text.length ? ' …' : '');
  el.prompt.innerHTML = `<span class="done">${before}</span>${current}<span class="pending">${after}</span>`;
  el.typedCount.textContent = state.correct;
  el.prompt.scrollTop = 0;
}

function setStatus(label, kind = '') {
  el.raceStatus.className = `race-status ${kind}`;
  el.raceStatus.innerHTML = `<span class="status-dot"></span> ${label}`;
}

function updateCars() {
  for (const [car, percent] of [[el.playerCar, playerProgress()], [el.rivalCar, state.rival]]) {
    const road = car.parentElement;
    const finishRight = window.innerWidth <= 700 ? 13 : 30;
    const maxLeft = Math.max(18, road.clientWidth - finishRight - 19 - car.offsetWidth);
    car.style.left = `${18 + (maxLeft - 18) * Math.min(1, percent)}px`;
  }
  el.playerPercent.textContent = `${Math.round(playerProgress() * 100)}%`;
  el.rivalPercent.textContent = `${Math.round(state.rival * 100)}%`;
}

function updateStats() {
  const minutes = state.elapsed / 60000;
  const wpm = minutes > 0 ? Math.round(state.correct / 5 / minutes) : 0;
  const accuracy = state.correct + state.errors ? Math.round(state.correct / (state.correct + state.errors) * 100) : 100;
  el.wpm.textContent = Number.isFinite(wpm) ? wpm : 0;
  el.accuracy.textContent = accuracy;
  el.mistakes.textContent = state.errors;
  el.timer.textContent = (state.elapsed / 1000).toFixed(1);
  updateRemaining();
}

function clearCountdown() {
  if (state.countdownTimer) clearTimeout(state.countdownTimer);
  state.countdownTimer = null;
  el.countdown.hidden = true;
}

function bestKey() { return `typerace-best-wpm-${el.language.value}`; }

function updateBest() {
  let best = 0;
  try { best = Number(localStorage.getItem(bestKey()) || (el.language.value === 'ru' ? localStorage.getItem('typerace-best-wpm') : 0) || 0); } catch (_) { /* Local storage is optional. */ }
  el.bestScore.textContent = best ? `${best} сл/мин` : '—';
  return best;
}

function prepareText() {
  cancelAnimationFrame(state.frame);
  clearCountdown();
  state.phase = 'ready'; state.correct = 0; state.errors = 0; state.elapsed = 0; state.rival = 0; state.freezeUntil = 0;
  const language = el.language.value;
  state.goal = state.mode === 'free' ? 0 : Number(el.goal.value);
  const wordCount = state.mode === 'words' ? state.goal : 1200;
  state.text = buildText(language, wordCount);
  state.textLanguage = language;
  el.typeInput.value = ''; el.typeInput.disabled = true;
  el.typeInput.placeholder = 'Нажми «Начать заезд», затем печатай здесь';
  el.difficulty.disabled = false; el.language.disabled = false; el.goal.disabled = false;
  modeButtons.forEach(button => button.disabled = false);
  el.newTextButton.disabled = false;
  el.finishButton.hidden = true;
  el.languageLabel.textContent = languageNames[language];
  el.difficultyLabel.textContent = labels[el.difficulty.value];
  el.totalCount.textContent = state.text.length;
  el.track.classList.remove('is-running');
  el.playerCar.classList.remove('penalty'); el.inputWrap.classList.remove('error');
  el.typingHint.textContent = layoutHints[language];
  el.startButton.querySelector('span').textContent = 'НАЧАТЬ ЗАЕЗД';
  el.startButton.disabled = false;
  setStatus('ОЖИДАНИЕ СТАРТА');
  renderPrompt(); updateStats(); updateCars(); updateBest();
}

function beginCountdown() {
  if (online.code) { startOnline(); return; }
  if (state.phase !== 'ready') return;
  state.phase = 'countdown'; state.raceNumber++;
  el.raceNumber.textContent = `#${String(state.raceNumber).padStart(2, '0')}`;
  el.difficulty.disabled = true; el.language.disabled = true; el.goal.disabled = true; el.startButton.disabled = true;
  el.newTextButton.disabled = true; modeButtons.forEach(button => button.disabled = true);
  setStatus('ПРИГОТОВЬСЯ');
  let count = 3;
  const step = () => {
    if (state.phase !== 'countdown') return;
    el.countdown.hidden = false;
    el.countdown.textContent = count > 0 ? count : 'GO!';
    sound(count > 0 ? 440 : 720, .12);
    if (count === 0) { state.countdownTimer = setTimeout(startRace, 420); return; }
    count--; state.countdownTimer = setTimeout(step, 760);
  };
  step();
}

function startRace() {
  if (state.phase !== 'countdown') return;
  clearCountdown(); state.phase = 'running'; state.startAt = performance.now();
  el.track.classList.add('is-running');
  el.finishButton.hidden = !!online.code && online.role !== 'host';
  el.typeInput.disabled = false; el.typeInput.placeholder = 'Печатай текст выше…'; el.typeInput.focus();
  el.typingHint.textContent = 'Держи темп — соперник уже едет!';
  setStatus('ГОНКА ИДЕТ', 'running');
  state.frame = requestAnimationFrame(tick);
}

function tick(now) {
  if (state.phase !== 'running') return;
  state.elapsed = now - state.startAt;
  if (online.code) {
    updateStats(); updateCars();
    if (state.mode === 'time' && state.elapsed >= state.goal * 1000) { el.typeInput.disabled = true; setStatus('СЧИТАЕМ РЕЗУЛЬТАТ'); }
    state.frame = requestAnimationFrame(tick);
    return;
  }
  const rivalChars = state.elapsed * speeds[el.difficulty.value] * 5 / 60000;
  state.rival = state.mode === 'words' ? Math.min(1, rivalChars / state.text.length) : state.mode === 'time' ? Math.min(1, state.elapsed / (state.goal * 1000)) : Math.min(1, rivalChars / state.text.length);
  updateStats(); updateCars();
  if (state.mode === 'words' && state.rival >= 1) { finish('lost'); return; }
  if (state.mode === 'time' && state.elapsed >= state.goal * 1000) { finish(state.correct >= rivalChars ? 'won' : 'lost'); return; }
  state.frame = requestAnimationFrame(tick);
}

function finish(outcome) {
  if (state.phase !== 'running') return;
  state.phase = 'finished'; cancelAnimationFrame(state.frame);
  clearTimeout(online.syncTimer);
  state.elapsed = Math.min(performance.now() - state.startAt, state.mode === 'time' ? state.goal * 1000 : Infinity);
  if (outcome === 'won' && state.mode === 'words') state.correct = state.text.length;
  el.typeInput.disabled = true; el.track.classList.remove('is-running');
  el.finishButton.hidden = true;
  updateStats(); updateCars();
  setStatus(outcome === 'won' ? 'ТЫ ПОБЕДИЛ!' : outcome === 'lost' ? 'СОПЕРНИК ФИНИШИРОВАЛ' : outcome === 'tie' ? 'НИЧЬЯ' : 'ЗАЕЗД ЗАВЕРШЕН', 'finished');
  sound(outcome === 'won' ? 880 : 260, .22, outcome === 'won' ? 'sine' : 'triangle');
  const best = updateBest();
  const score = Number(el.wpm.textContent);
  if (outcome === 'won' && score > best) { try { localStorage.setItem(bestKey(), String(score)); } catch (_) { /* Keep the session record. */ } el.bestScore.textContent = `${score} сл/мин`; }
  el.resultKicker.textContent = outcome === 'won' ? 'ПОБЕДА · ФИНИШНАЯ ЧЕРТА' : 'ЗАЕЗД ЗАВЕРШЕН';
  el.resultIcon.textContent = outcome === 'won' ? '🏆' : '🏁';
  el.resultTitle.textContent = outcome === 'won' ? 'Ты первый!' : outcome === 'lost' ? 'Почти догнал!' : outcome === 'tie' ? 'Ничья!' : 'Заезд окончен';
  el.resultText.textContent = outcome === 'won' ? 'Отличный заезд. Сможешь побить свой рекорд?' : outcome === 'lost' ? 'Соперник пришел первым. Попробуй еще раз и держи ровный темп.' : outcome === 'tie' ? 'Вы финишировали с одинаковым результатом. Еще один заезд решит спор.' : 'Результат сохранен для этого заезда. Можешь выбрать другой формат и попробовать снова.';
  el.resultWpm.textContent = el.wpm.textContent;
  el.resultAccuracy.textContent = `${el.accuracy.textContent}%`;
  el.resultTime.textContent = el.timer.textContent;
  el.resultBackdrop.hidden = false;
  el.againButton.focus();
}

function handleInput() {
  if (state.phase !== 'running') return;
  const now = performance.now();
  const typed = el.typeInput.value;
  const correctPrefix = state.text.slice(0, state.correct);
  if (now < state.freezeUntil) { el.typeInput.value = correctPrefix; return; }
  if (typed === correctPrefix) return;
  if (typed.length < state.correct) { el.typeInput.value = correctPrefix; return; }
  let next = state.correct;
  while (next < typed.length && next < state.text.length && typed[next] === state.text[next]) next++;
  state.correct = next;
  el.typeInput.value = state.text.slice(0, state.correct);
  renderPrompt(); updateCars(); updateStats();
  if (state.correct === state.text.length) {
    if (online.code) { el.typeInput.disabled = true; setStatus('ОЖИДАЕМ ФИНИШ'); scheduleProgress(); }
    else finish('won');
    return;
  }
  if (next < typed.length) {
    state.errors++;
    state.freezeUntil = now + 650;
    el.playerCar.classList.add('penalty'); el.inputWrap.classList.add('error');
    el.typingHint.textContent = 'Ошибка! Машина замедлилась на мгновение';
    sound(180, .16, 'sawtooth');
    setTimeout(() => { if (performance.now() >= state.freezeUntil) { el.playerCar.classList.remove('penalty'); el.inputWrap.classList.remove('error'); if (state.phase === 'running') el.typingHint.textContent = 'Вернись в ритм и обгони соперника'; } }, 670);
    updateStats();
  }
  scheduleProgress();
}

el.startButton.addEventListener('click', beginCountdown);
el.newTextButton.addEventListener('click', prepareText);
el.finishButton.addEventListener('click', () => online.code ? stopOnline() : finish('stopped'));
modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
el.goal.addEventListener('change', prepareText);
el.language.addEventListener('change', prepareText);
el.difficulty.addEventListener('change', () => { el.difficultyLabel.textContent = labels[el.difficulty.value]; });
el.typeInput.addEventListener('input', handleInput);
el.typeInput.addEventListener('paste', event => event.preventDefault());
el.againButton.addEventListener('click', () => { const wasOnline = !!online.code; el.resultBackdrop.hidden = true; if (wasOnline) clearOnline(); prepareText(); if (!wasOnline) beginCountdown(); });
el.closeResultButton.addEventListener('click', () => { el.resultBackdrop.hidden = true; if (online.code) clearOnline(); prepareText(); el.startButton.focus(); });
el.createRoomButton.addEventListener('click', () => enterOnline('create'));
el.quickMatchButton.addEventListener('click', () => enterOnline('quick'));
el.joinRoomButton.addEventListener('click', () => enterOnline('join'));
el.roomCode.addEventListener('keydown', event => { if (event.key === 'Enter') enterOnline('join'); });
el.copyRoomButton.addEventListener('click', async () => { if (!online.code) return; const url = new URL(window.location.href); url.searchParams.set('room', online.code); try { await navigator.clipboard.writeText(url.href); onlineMessage('Ссылка скопирована. Отправь ее другу.'); } catch (_) { onlineMessage(`Ссылка для друга: ${url.href}`); } });
el.leaveRoomButton.addEventListener('click', async () => {
  if (online.code && online.room?.status !== 'finished') {
    if (online.role === 'host') await stopOnline();
    else try { await api(`/api/room/${online.code}/leave`, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({token:online.token})}); } catch (_) { /* Local exit still works. */ }
  }
  clearOnline(); el.resultBackdrop.hidden = true; prepareText();
});
el.soundButton.addEventListener('click', () => { state.sound = !state.sound; el.soundButton.setAttribute('aria-pressed', String(state.sound)); el.soundButton.querySelector('span').textContent = state.sound ? 'ЗВУК ВКЛ.' : 'ЗВУК ВЫКЛ.'; if (state.sound) sound(660); });
window.addEventListener('resize', updateCars);
prepareText();
try { el.playerName.value = localStorage.getItem('typerace-player-name') || ''; } catch (_) {}
const invitedCode = new URL(window.location.href).searchParams.get('room');
if (invitedCode && /^[A-Z2-9]{6}$/.test(invitedCode.toUpperCase())) {
  el.roomCode.value = invitedCode.toUpperCase();
  let token = null;
  try { token = sessionStorage.getItem(`typerace-room-${el.roomCode.value}`); } catch (_) {}
  if (token) {
    showConnecting();
    api(`/api/room/${el.roomCode.value}/state?token=${encodeURIComponent(token)}`)
      .then(({room}) => activateOnline(room, token))
      .catch(() => { state.phase = 'ready'; lockOnlineSettings(false); enterOnline('join'); });
  } else enterOnline('join');
}
