// script.js
//
// All game logic lives here: screens, scoring, colour schemes, the
// multiple-choice engine, recall mode, etc. This file does NOT contain any
// vocabulary data itself — it borrows the word lists from vocab-data.js
// using "import", and it does not contain any HTML — it only reaches into
// the page (index.html) by element id, the same way the original single file
// did.
//
// The line below is the "import" side of the export/import pair. It says:
// "bring in the LISTS registry that vocab-data.js exported, and let me refer
// to it as LISTS in this file." The { } curly braces matter — they mean
// "give me specifically the thing named LISTS", not everything in the file.
// The './' at the start of the path means "look in this same folder".
import { LISTS, HOUSEHOLD_LISTS } from './vocab-data.js?v=4';

  // ---------- colour schemes ----------
  const SCHEMES = [
    { name: 'Midnight Ink',         ink: '#e8e6e1', paper: '#1b1b1d', muted: '#7a7a7f', accent: '#6e9fff' },
    { name: 'Espresso Dark',        ink: '#f0e6da', paper: '#241812', muted: '#8a7566', accent: '#d98c3f' },
    { name: 'Deep Forest',          ink: '#e7f0e9', paper: '#10201a', muted: '#6f8a7a', accent: '#57c785' },
    { name: 'Nightshade Plum',      ink: '#ecdff5', paper: '#1e1526', muted: '#8b7a97', accent: '#b98ce0' },
    { name: 'Greyscale',            ink: '#f5f5f5', paper: '#101010', muted: '#8a8a8a', accent: '#cfcfcf' },
    { name: 'Italia',               ink: '#046a38', paper: '#fdfdfb', muted: '#7a7a7a', accent: '#cd212a' },
    { name: 'Dusty Blue & Blush',   ink: '#4a5b73', paper: '#f5f1ee', muted: '#9aa5ad', accent: '#d98e8e' },
    { name: 'Terracotta & Cream',   ink: '#5c3a21', paper: '#faf3e8', muted: '#b0a18f', accent: '#c1642f' },
    { name: 'Sage & Mustard',       ink: '#3f4d3b', paper: '#f3f5ee', muted: '#9aa08e', accent: '#c9a227' },
    { name: 'Lavender Fields',      ink: '#4b3b63', paper: '#f6f2fa', muted: '#b6a9c9', accent: '#8e6bb3' },
    { name: 'Amalfi Coast',         ink: '#1f4e5f', paper: '#fdf6ec', muted: '#9db6bd', accent: '#e0a458' },
    { name: 'Tuscan Olive',         ink: '#2B3027', paper: '#F4F3EE', muted: '#70756A', accent: '#606C38' },
    { name: 'Venetian Terracotta',  ink: '#33221C', paper: '#FAF6F0', muted: '#8C736A', accent: '#BC4749' },
    { name: 'Roman Marble',         ink: '#111111', paper: '#FCFCFC', muted: '#666666', accent: '#9A7B38' },
    { name: 'Sicilian Lemon',       ink: '#1D2A32', paper: '#FFFDF9', muted: '#6E7C85', accent: '#D4A373' },
    { name: 'Alpine Pine',          ink: '#1A2824', paper: '#F2F5F4', muted: '#60726C', accent: '#2D6A4F' },
    { name: 'Espresso Macchiato',   ink: '#2A201B', paper: '#F7F2EC', muted: '#827267', accent: '#A65D37' },
    { name: 'Adriatic Dusk',        ink: '#F0F4F8', paper: '#1E2229', muted: '#8B9BB4', accent: '#E07A5F' },
    { name: 'Piedmont Truffle',     ink: '#292522', paper: '#F5F2EC', muted: '#7D756D', accent: '#8C6D53' },
    { name: 'Florentine Paper',     ink: '#262322', paper: '#FBF8F2', muted: '#807570', accent: '#78290F' },
  ];
  let schemeIndex = 0;

  function applyScheme(idx) {
    const s = SCHEMES[idx];
    const root = document.documentElement.style;
    root.setProperty('--ink', s.ink);
    root.setProperty('--paper', s.paper);
    root.setProperty('--muted', s.muted);
    root.setProperty('--accent', s.accent);
    root.setProperty('--line', s.ink);
    document.querySelectorAll('.swatch-a').forEach(el => el.style.fill = s.ink);
    document.querySelectorAll('.swatch-b').forEach(el => el.style.fill = s.accent);
    document.querySelectorAll('.swatch-c').forEach(el => el.style.fill = s.muted);
  }

  document.querySelectorAll('.scheme-btn').forEach(btn => btn.addEventListener('click', () => {
    schemeIndex = (schemeIndex + 1) % SCHEMES.length;
    applyScheme(schemeIndex);
  }));

  applyScheme(schemeIndex);

  // ---------- state ----------
  let VOCAB = [];        // active list's [Italian, English] pairs
  let currentListLabel = '';
  let gameSourceScreen = null; // screen to return to when "Back" is pressed in-game
  let direction = 'en2it'; // 'en2it': question in English, options in Italian (default) · 'it2en': reversed
  let optionCount = 4; // number of multiple-choice options shown per question: 4, 6, or 8
  let blackout = false; // recall mode: when true, options render as solid blocks until hovered
  let masterPool = []; // full pairs list for the active topic, used to draw multiple-choice distractors from — stays full-size even during "Retry mistakes" so the option count never shrinks
  let queue = [];        // shuffled indices into VOCAB, not yet answered
  let currentIndex = -1; // index into VOCAB for the active question
  let correctCount = 0;
  let wrongCount = 0;
  let wrongAnswers = []; // [ [Italian, English], ... ]
  let totalQuestions = 0;
  let locked = false;

  // Recall-mode hover-lock: guards against the browser instantly hovering a
  // freshly-rendered option because the cursor happened to be resting over
  // that spot when the new question appeared. Reveal-on-hover stays gated
  // until BOTH a short timer has elapsed AND the mouse has racked up enough
  // total travel (sum of every movement since the question loaded, not just
  // distance from the starting point) — i.e. a real, deliberate hover.
  let mouseX = 0, mouseY = 0;
  let lastMoveX = 0, lastMoveY = 0;
  let cumulativeDistance = 0;
  let hoverLocked = false;
  let lockTimeExpired = false;
  let lockTimeoutId = null;
  const HOVER_LOCK_MS = 350;
  const HOVER_LOCK_DISTANCE = 150;

  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMoveX;
    const dy = e.clientY - lastMoveY;
    cumulativeDistance += Math.sqrt(dx * dx + dy * dy);
    lastMoveX = e.clientX;
    lastMoveY = e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    checkHoverArm();
  });

  function checkHoverArm() {
    if (!hoverLocked || !lockTimeExpired) return;
    if (cumulativeDistance > HOVER_LOCK_DISTANCE) {
      hoverLocked = false;
      document.querySelectorAll('#options-grid .option').forEach(opt => opt.classList.remove('hover-locked'));
    }
  }

  // ---------- elements ----------
  const screenStart     = document.getElementById('screen-start');
  const screenType      = document.getElementById('screen-type');
  const screenMenu      = document.getElementById('screen-menu');
  const screenVocab     = document.getElementById('screen-vocab');
  const screenHousehold = document.getElementById('screen-household');
  const screenGame      = document.getElementById('screen-game');
  const screenEnd       = document.getElementById('screen-end');

  function showScreen(el) {
    [screenStart, screenType, screenMenu, screenVocab, screenHousehold, screenGame, screenEnd].forEach(s => s.classList.add('hidden'));
    el.classList.remove('hidden');
  }

  document.getElementById('btn-goto-menu').addEventListener('click', () => showScreen(screenType));
  document.getElementById('type-item-verbs').addEventListener('click', () => showScreen(screenMenu));
  document.getElementById('type-item-vocab').addEventListener('click', () => showScreen(screenVocab));
  document.getElementById('btn-back-start-from-type').addEventListener('click', () => showScreen(screenStart));
  document.getElementById('btn-back-start').addEventListener('click', () => showScreen(screenType));
  document.getElementById('btn-back-start-from-vocab').addEventListener('click', () => showScreen(screenType));
  document.getElementById('menu-item-are').addEventListener('click', () => startGame('are', screenMenu, LISTS));
  document.getElementById('menu-item-ere').addEventListener('click', () => startGame('ere', screenMenu, LISTS));
  document.getElementById('menu-item-ere-irregular').addEventListener('click', () => startGame('ereIrregular', screenMenu, LISTS));

  // "Household (La casa)" is a category, not a quiz — it navigates one level
  // deeper to screen-household rather than calling startGame.
  document.getElementById('menu-item-household-category').addEventListener('click', () => showScreen(screenHousehold));
  document.getElementById('btn-back-vocab-from-household').addEventListener('click', () => showScreen(screenVocab));

  document.getElementById('menu-item-hh-bathroom').addEventListener('click', () => startGame('bathroom', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-bedroom').addEventListener('click', () => startGame('bedroom', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-garage-shed').addEventListener('click', () => startGame('garageShed', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-garden-outdoors').addEventListener('click', () => startGame('gardenOutdoors', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-house-fixtures').addEventListener('click', () => startGame('houseFixtures', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-kitchen-dining').addEventListener('click', () => startGame('kitchenDining', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-living-room').addEventListener('click', () => startGame('livingRoom', screenHousehold, HOUSEHOLD_LISTS));
  document.getElementById('menu-item-hh-study').addEventListener('click', () => startGame('study', screenHousehold, HOUSEHOLD_LISTS));

  // "Random (Casuale)" isn't a fixed list — build a fresh 50-word draw from
  // every household sub-category, re-shuffled each time it's played.
  document.getElementById('menu-item-hh-random').addEventListener('click', () => startRandomHousehold());

  document.getElementById('game-home-btn').addEventListener('click', () => showScreen(screenStart));
  document.getElementById('game-back-btn').addEventListener('click', () => showScreen(gameSourceScreen || screenType));

  function questionLangIdx() { return direction === 'it2en' ? 0 : 1; } // index into a [Italian, English] pair used for the question
  function optionLangIdx()   { return direction === 'it2en' ? 1 : 0; } // index used for the multiple-choice options

  function updateDirButtons() {
    const label = direction === 'it2en' ? 'IT → EN' : 'EN → IT';
    document.querySelectorAll('.dir-btn').forEach(btn => btn.textContent = label);
  }
  document.querySelectorAll('.dir-btn').forEach(btn => btn.addEventListener('click', () => {
    direction = direction === 'it2en' ? 'en2it' : 'it2en';
    updateDirButtons();
  }));
  updateDirButtons();

  const EYE_OPEN_SVG =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"></path>' +
    '<circle cx="12" cy="12" r="3"></circle>' +
    '</svg>';
  const EYE_SLASH_SVG =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path>' +
    '<path d="M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a10.4 10.4 0 0 0 4.2-.9M10.6 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.2"></path>' +
    '<path d="M3 3l18 18"></path>' +
    '</svg>';

  const blackoutBtn = document.getElementById('blackout-btn');

  function applyBlackout() {
    document.querySelectorAll('#options-grid .option:not(:disabled)').forEach(opt => {
      opt.classList.toggle('blacked', blackout);
    });
  }

  function updateBlackoutButton() {
    blackoutBtn.innerHTML = blackout ? EYE_SLASH_SVG : EYE_OPEN_SVG;
    blackoutBtn.classList.toggle('active', blackout);
    blackoutBtn.title = blackout
      ? 'Recall mode: ON — hover an option to reveal it'
      : 'Recall mode: OFF — toggle to hide answers until hovered';
  }
  blackoutBtn.addEventListener('click', () => {
    blackout = !blackout;
    updateBlackoutButton();
    applyBlackout();
  });
  updateBlackoutButton();

  function updateCountButtons() {
    document.querySelectorAll('.count-btn').forEach(btn => btn.textContent = String(optionCount));
  }
  document.querySelectorAll('.count-btn').forEach(btn => btn.addEventListener('click', () => {
    optionCount = optionCount === 4 ? 6 : (optionCount === 6 ? 8 : 4);
    updateCountButtons();
  }));
  updateCountButtons();
  document.getElementById('btn-restart').addEventListener('click', () => {
    document.getElementById('review-list').classList.add('hidden');
    document.getElementById('review-list').innerHTML = '';
    showScreen(screenType);
  });

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startGame(listKey, sourceScreen, registry) {
    const list = (registry || LISTS)[listKey];
    startGameWithPairs(list.pairs, list.label, list.footer, sourceScreen, list.pairs);
  }

  // Builds a fresh 50-pair "Random (Casuale)" round by pooling every
  // household sub-category together and shuffling. Runs again from scratch
  // each time the tile is clicked, so a new draw appears every play.
  // masterPool is set to this same 50-pair draw (not the full ~399-pair
  // pool) so multiple-choice distractors stay consistent with how every
  // other list already works: drawn from the list actually being played.
  function startRandomHousehold() {
    const allHouseholdPairs = Object.values(HOUSEHOLD_LISTS).flatMap(list => list.pairs);
    const randomPairs = shuffle(allHouseholdPairs).slice(0, 50);
    const label = 'Random (Casuale)';
    const footer = label + ' · ' + randomPairs.length + ' pairs';
    startGameWithPairs(randomPairs, label, footer, screenHousehold, randomPairs);
  }

  function startGameWithPairs(pairs, label, footer, sourceScreen, pool) {
    VOCAB = pairs;
    currentListLabel = label;
    totalQuestions = VOCAB.length;
    gameSourceScreen = sourceScreen || screenType;
    masterPool = pool || pairs;
    document.getElementById('game-footer-note').textContent = footer;
    queue = shuffle([...Array(VOCAB.length).keys()]);
    correctCount = 0;
    wrongCount = 0;
    wrongAnswers = [];
    showScreen(screenGame);
    nextQuestion();
  }

  document.getElementById('btn-retry-mistakes').addEventListener('click', () => {
    if (wrongAnswers.length === 0) return;
    const pairs = wrongAnswers.slice();
    const baseLabel = currentListLabel.replace(/ — Retry mistakes$/, '');
    const label = baseLabel + ' — Retry mistakes';
    const footer = label + ' · ' + pairs.length + ' pairs';
    startGameWithPairs(pairs, label, footer, gameSourceScreen, masterPool);
  });

  function updateStatus() {
    const answered = correctCount + wrongCount;
    document.getElementById('progress-text').textContent =
      'Question ' + Math.min(answered + 1, totalQuestions) + ' / ' + totalQuestions;
    document.getElementById('score-text').textContent =
      'Correct ' + correctCount + ' · Wrong ' + wrongCount;
    document.getElementById('progress-fill').style.width =
      (answered / totalQuestions * 100) + '%';
  }

  function nextQuestion() {
    if (queue.length === 0) {
      endGame();
      return;
    }
    locked = false;

    // Reset the hover-lock's travel counter every time a new question loads,
    // so movement from before the question appeared doesn't carry over.
    if (lockTimeoutId) clearTimeout(lockTimeoutId);
    hoverLocked = blackout;
    lockTimeExpired = false;
    cumulativeDistance = 0;
    lastMoveX = mouseX;
    lastMoveY = mouseY;
    if (blackout) {
      lockTimeoutId = setTimeout(() => {
        lockTimeExpired = true;
        checkHoverArm();
      }, HOVER_LOCK_MS);
    }

    currentIndex = queue.pop();
    const pair = VOCAB[currentIndex];
    const qIdx = questionLangIdx();
    const oIdx = optionLangIdx();

    document.getElementById('question-text').textContent = pair[qIdx];
    updateStatus();

    // build distractors (optionCount - 1 of them), unique, not the correct one.
    // Drawn from masterPool (the full topic list) rather than VOCAB, so the
    // option count stays correct even when the active question set is small
    // (e.g. "Retry mistakes" with only 1-2 pairs left) — still capped so we
    // never ask a small master list for more than it can supply.
    const distractorPool = masterPool.filter(p => !(p[0] === pair[0] && p[1] === pair[1]));
    const distractorsNeeded = Math.min(optionCount - 1, distractorPool.length);
    const distractors = shuffle(distractorPool).slice(0, distractorsNeeded);
    const optionPairs = shuffle([pair, ...distractors]);

    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    optionPairs.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'option' + (blackout ? ' blacked hover-locked' : '');
      btn.textContent = p[oIdx];
      btn.addEventListener('click', () => selectAnswer(p === pair, btn));
      grid.appendChild(btn);
    });
  }

  function selectAnswer(isCorrect, btnEl) {
    if (locked) return;
    locked = true;
    hoverLocked = false;
    document.querySelectorAll('#options-grid .option').forEach(opt => opt.classList.remove('blacked', 'hover-locked'));

    if (isCorrect) {
      correctCount++;
      btnEl.classList.add('correct-flash');
    } else {
      wrongCount++;
      wrongAnswers.push(VOCAB[currentIndex]);
      btnEl.classList.add('wrong-flash', 'shake');
      // reveal the correct one too
      const oIdx = optionLangIdx();
      document.querySelectorAll('.option').forEach(opt => {
        if (opt.textContent === VOCAB[currentIndex][oIdx]) {
          opt.classList.add('reveal-correct');
        }
      });
    }

    document.querySelectorAll('.option').forEach(opt => opt.disabled = true);
    updateStatus();

    setTimeout(nextQuestion, isCorrect ? 380 : 620);
  }

  function getGrade(pct) {
    if (pct >= 95) return 'A*';
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    if (pct >= 50) return 'E';
    return 'F';
  }

  function endGame() {
    const pct = Math.round((correctCount / totalQuestions) * 1000) / 10;
    document.getElementById('grade-letter').textContent = getGrade(pct);
    document.getElementById('score-line').textContent =
      correctCount + ' / ' + totalQuestions + ' correct — ' + pct + '%';
    document.getElementById('end-correct').textContent = correctCount;
    document.getElementById('end-wrong').textContent = wrongCount;
    document.getElementById('btn-retry-mistakes').classList.toggle('hidden', wrongAnswers.length === 0);
    showScreen(screenEnd);
  }

  document.getElementById('btn-review').addEventListener('click', () => {
    const list = document.getElementById('review-list');
    if (!list.classList.contains('hidden')) {
      list.classList.add('hidden');
      return;
    }
    list.innerHTML = '';
    if (wrongAnswers.length === 0) {
      list.innerHTML = '<div class="review-row">Nothing incorrect — clean sweep.</div>';
    } else {
      wrongAnswers.forEach(([it, en]) => {
        const row = document.createElement('div');
        row.className = 'review-row';
        row.innerHTML = '<span class="it">' + it + '</span><span class="en">' + en + '</span>';
        list.appendChild(row);
      });
    }
    list.classList.remove('hidden');
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    let text = 'Incorrect answers — ' + currentListLabel + '\n';
    text += 'Score: ' + correctCount + '/' + totalQuestions + '\n';
    text += '----------------------------------------\n';
    if (wrongAnswers.length === 0) {
      text += 'None — all correct.\n';
    } else {
      wrongAnswers.forEach(([it, en]) => {
        text += it + '  —  ' + en + '\n';
      });
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incorrect_answers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
