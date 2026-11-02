const texts = [
  'Скорость приходит с практикой. Держи взгляд на дороге, чувствуй ритм клавиш и не позволяй ошибкам сбить тебя с пути.',
  'Ночной город мелькает за окном. До финиша осталось совсем немного, а впереди ещё один поворот и шанс вырваться вперёд.',
  'Каждая секунда имеет значение. Печатай уверенно, сохраняй спокойствие и набирай скорость на последнем участке трассы.',
  'На старте все равны. Побеждает тот, кто умеет держать темп, быстро исправлять ошибки и не сдаваться до самого финиша.',
  'Дождь стучит по стеклу, огни отражаются на мокром асфальте. Машина набирает ход, пока пальцы танцуют по клавиатуре.',
  'Когда мотор ревёт и дорога зовёт вперёд, остаётся только одно: собраться, поймать ритм и пройти дистанцию без ошибок.'
];

const $ = id => document.getElementById(id);
const el = Object.fromEntries(['raceNumber','raceStatus','track','rivalPercent','playerPercent','rivalCar','playerCar','countdown','wpm','accuracy','mistakes','timer','prompt','typeInput','inputWrap','typingHint','typedCount','totalCount','startButton','newTextButton','difficulty','difficultyLabel','bestScore','soundButton','resultBackdrop','resultKicker','resultIcon','resultTitle','resultText','resultWpm','resultAccuracy','resultTime','againButton'].map(id => [id, $(id)]));
const speeds = {easy: 33, medium: 48, hard: 65};
const labels = {easy: 'ЛЁГКИЙ', medium: 'СРЕДНИЙ', hard: 'СЛОЖНЫЙ'};
const state = {phase: 'ready', text: '', index: -1, correct: 0, errors: 0, startAt: 0, elapsed: 0, rival: 0, freezeUntil: 0, frame: 0, countdownTimer: null, raceNumber: 0, sound: false};
let audioContext;

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
  const before = escapeHTML(state.text.slice(0, state.correct));
  const current = state.correct < state.text.length ? `<span class="current">${escapeHTML(state.text[state.correct])}</span>` : '';
  const after = escapeHTML(state.text.slice(state.correct + 1));
  el.prompt.innerHTML = `<span class="done">${before}</span>${current}<span class="pending">${after}</span>`;
  el.typedCount.textContent = state.correct;
}

function setStatus(label, kind = '') {
  el.raceStatus.className = `race-status ${kind}`;
  el.raceStatus.innerHTML = `<span class="status-dot"></span> ${label}`;
}

function updateCars() {
  for (const [car, percent] of [[el.playerCar, state.correct / state.text.length], [el.rivalCar, state.rival]]) {
    const road = car.parentElement;
    const finishRight = window.innerWidth <= 700 ? 13 : 30;
    const maxLeft = Math.max(18, road.clientWidth - finishRight - 19 - car.offsetWidth);
    car.style.left = `${18 + (maxLeft - 18) * Math.min(1, percent)}px`;
  }
  el.playerPercent.textContent = `${Math.round(state.correct / state.text.length * 100)}%`;
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
}

function clearCountdown() {
  if (state.countdownTimer) clearTimeout(state.countdownTimer);
  state.countdownTimer = null;
  el.countdown.hidden = true;
}

function prepareText() {
  cancelAnimationFrame(state.frame);
  clearCountdown();
  state.phase = 'ready'; state.correct = 0; state.errors = 0; state.elapsed = 0; state.rival = 0; state.freezeUntil = 0;
  let next = state.index;
  while (next === state.index) next = Math.floor(Math.random() * texts.length);
  state.index = next; state.text = texts[next];
  el.typeInput.value = ''; el.typeInput.disabled = true;
  el.typeInput.placeholder = 'Нажми «Начать заезд», затем печатай здесь';
  el.difficulty.disabled = false;
  el.difficultyLabel.textContent = labels[el.difficulty.value];
  el.totalCount.textContent = state.text.length;
  el.track.classList.remove('is-running');
  el.playerCar.classList.remove('penalty'); el.inputWrap.classList.remove('error');
  el.typingHint.textContent = 'Правильные символы двигают тебя вперёд';
  el.startButton.querySelector('span').textContent = 'НАЧАТЬ ЗАЕЗД';
  el.startButton.disabled = false;
  setStatus('ОЖИДАНИЕ СТАРТА');
  renderPrompt(); updateStats(); updateCars();
}

function beginCountdown() {
  if (state.phase !== 'ready') return;
  state.phase = 'countdown'; state.raceNumber++;
  el.raceNumber.textContent = `#${String(state.raceNumber).padStart(2, '0')}`;
  el.difficulty.disabled = true; el.startButton.disabled = true;
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
  el.typeInput.disabled = false; el.typeInput.placeholder = 'Печатай текст выше…'; el.typeInput.focus();
  el.typingHint.textContent = 'Держи темп — соперник уже едет!';
  setStatus('ГОНКА ИДЁТ', 'running');
  state.frame = requestAnimationFrame(tick);
}

function tick(now) {
  if (state.phase !== 'running') return;
  state.elapsed = now - state.startAt;
  const charsPerMs = speeds[el.difficulty.value] * 5 / 60000;
  state.rival = Math.min(1, state.elapsed * charsPerMs / state.text.length);
  updateStats(); updateCars();
  if (state.rival >= 1) { finish(false); return; }
  state.frame = requestAnimationFrame(tick);
}

function finish(won) {
  if (state.phase !== 'running') return;
  state.phase = 'finished'; cancelAnimationFrame(state.frame);
  state.elapsed = performance.now() - state.startAt;
  if (won) state.correct = state.text.length;
  el.typeInput.disabled = true; el.track.classList.remove('is-running');
  updateStats(); updateCars();
  setStatus(won ? 'ТЫ ПОБЕДИЛ!' : 'СОПЕРНИК ФИНИШИРОВАЛ', 'finished');
  sound(won ? 880 : 260, .22, won ? 'sine' : 'triangle');
  let best = 0;
  try { best = Number(localStorage.getItem('typerace-best-wpm') || 0); } catch (_) { /* Local storage is optional. */ }
  const score = Number(el.wpm.textContent);
  if (won && score > best) { try { localStorage.setItem('typerace-best-wpm', String(score)); } catch (_) { /* Keep the session record. */ } el.bestScore.textContent = `${score} сл/мин`; }
  el.resultKicker.textContent = won ? 'ПОБЕДА · ФИНИШНАЯ ЧЕРТА' : 'ЗАЕЗД ЗАВЕРШЁН';
  el.resultIcon.textContent = won ? '🏆' : '🏁';
  el.resultTitle.textContent = won ? 'Ты первый!' : 'Почти догнал!';
  el.resultText.textContent = won ? 'Отличный заезд. Сможешь побить свой рекорд?' : 'Соперник пришёл первым. Попробуй ещё раз и держи ровный темп.';
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
  if (state.correct === state.text.length) { finish(true); return; }
  if (next < typed.length) {
    state.errors++;
    state.freezeUntil = now + 650;
    el.playerCar.classList.add('penalty'); el.inputWrap.classList.add('error');
    el.typingHint.textContent = 'Ошибка! Машина замедлилась на мгновение';
    sound(180, .16, 'sawtooth');
    setTimeout(() => { if (performance.now() >= state.freezeUntil) { el.playerCar.classList.remove('penalty'); el.inputWrap.classList.remove('error'); if (state.phase === 'running') el.typingHint.textContent = 'Вернись в ритм и обгони соперника'; } }, 670);
    updateStats();
  }
}

el.startButton.addEventListener('click', beginCountdown);
el.newTextButton.addEventListener('click', prepareText);
el.difficulty.addEventListener('change', () => { el.difficultyLabel.textContent = labels[el.difficulty.value]; });
el.typeInput.addEventListener('input', handleInput);
el.typeInput.addEventListener('paste', event => event.preventDefault());
el.againButton.addEventListener('click', () => { el.resultBackdrop.hidden = true; prepareText(); beginCountdown(); });
el.soundButton.addEventListener('click', () => { state.sound = !state.sound; el.soundButton.setAttribute('aria-pressed', String(state.sound)); el.soundButton.querySelector('span').textContent = state.sound ? 'ЗВУК ВКЛ.' : 'ЗВУК ВЫКЛ.'; if (state.sound) sound(660); });
window.addEventListener('resize', updateCars);
try { const best = Number(localStorage.getItem('typerace-best-wpm') || 0); if (best) el.bestScore.textContent = `${best} сл/мин`; } catch (_) { /* Local storage is optional. */ }
prepareText();
