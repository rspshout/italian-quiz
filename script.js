// script.js
//
// All game logic lives here: screens, scoring, colour schemes, the
// multiple-choice engine, recall mode, etc. This file does NOT contain any
// vocabulary data itself — it borrows the word lists from verbs-data.js and
// vocab-household.js using "import", and it does not contain any HTML — it
// only reaches into
// the page (index.html) by element id, the same way the original single file
// did.
//
// The lines below are the "import" side of the export/import pair. Each
// says: "bring in the named registry that this file exported, and let me
// refer to it by that name in this file." The { } curly braces matter —
// they mean "give me specifically the thing with this name", not
// everything in the file. The './' at the start of each path means "look
// in this same folder". LISTS (the verb lists), HOUSEHOLD_LISTS (the
// Household sub-category lists), FOOD_DRINK_LISTS (the Food & Drink
// sub-category lists), and VOCAB_A_TO_Z (the full "A to Z" list) live in
// separate files — verbs-data.js, vocab-household.js, vocab-food-drink.js,
// and vocab-a-to-z.js — each with its own "?v=N" cache-busting number, so
// any one can be bumped independently when its own content changes.
import { LISTS } from './verbs-data.js?v=1';
import { HOUSEHOLD_LISTS } from './vocab-household.js?v=1';
import { FOOD_DRINK_LISTS } from './vocab-food-drink.js?v=1';
import { TRAVEL_VEHICLES_LISTS } from './vocab-travel-vehicles.js?v=1';
import { ANIMALS_LISTS } from './vocab-animals.js?v=1';
import { VOCAB_A_TO_Z } from './vocab-a-to-z.js?v=1';

  // ---------- colour schemes ----------
      const SCHEMES = [
    { name: 'Midnight Ink',         ink: '#e8e6e1', paper: '#1b1b1d', muted: '#7a7a7f', accent: '#6e9fff' },
    { name: 'Greyscale',            ink: '#f5f5f5', paper: '#101010', muted: '#8a8a8a', accent: '#cfcfcf' },
    { name: 'Adriatic Dusk',        ink: '#F0F4F8', paper: '#1E2229', muted: '#8B9BB4', accent: '#E07A5F' },
    { name: 'Espresso Dark',        ink: '#f0e6da', paper: '#241812', muted: '#8a7566', accent: '#d98c3f' },
    { name: 'Deep Forest',          ink: '#e7f0e9', paper: '#10201a', muted: '#6f8a7a', accent: '#57c785' },
    { name: 'Nightshade Plum',      ink: '#ecdff5', paper: '#1e1526', muted: '#8b7a97', accent: '#b98ce0' },
    { name: 'Italia',               ink: '#046a38', paper: '#fdfdfb', muted: '#7a7a7a', accent: '#cd212a' },
    { name: 'Amalfi Coast',         ink: '#1f4e5f', paper: '#fdf6ec', muted: '#9db6bd', accent: '#e0a458' },
    { name: 'Dusty Blue & Blush',   ink: '#4a5b73', paper: '#f5f1ee', muted: '#9aa5ad', accent: '#d98e8e' },
    { name: 'Venetian Terracotta',  ink: '#33221C', paper: '#FAF6F0', muted: '#8C736A', accent: '#BC4749' },
    { name: 'Florentine Paper',     ink: '#262322', paper: '#FBF8F2', muted: '#807570', accent: '#78290F' },
    { name: 'Roman Marble',         ink: '#111111', paper: '#FCFCFC', muted: '#666666', accent: '#9A7B38' },
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

  // ---------- font toggle ----------
  // A circular .font-btn (styled and hover-animated identically to
  // .scheme-btn, via the same shared class) appears on every screen and
  // cycles the app's global font. Helvetica Neue is not offered here at
  // all — it didn't fix the "Il" legibility problem — and Verdana is now
  // the permanent default (see style.css's html, body font-family), so
  // it stays first in this list too.
  const FONT_PRESETS = [
    { name: 'Verdana / Humanist Sans',   family: "Verdana, Geneva, sans-serif" },
    { name: 'Georgia / Serif',           family: "Georgia, 'Times New Roman', serif" },
    { name: 'Courier New / Monospace',   family: "'Courier New', Courier, monospace" },
    { name: 'Chalkboard / Handwriting',  family: "'Chalkboard SE', 'Comic Sans MS', 'Segoe Print', cursive" },
  ];
  let fontIndex = 0;

  function applyFont(idx) {
    const f = FONT_PRESETS[idx];
    document.documentElement.style.fontFamily = f.family;
    document.body.style.fontFamily = f.family;
    document.querySelectorAll('.font-btn').forEach(btn => {
      btn.title = 'Change font (current: ' + f.name + ')';
    });
    // The "Aa" glyph inside each font button is rendered in the font it
    // would switch TO from here — i.e. the currently active one — so it
    // always previews what's currently applied, not a fixed placeholder.
    document.querySelectorAll('.font-btn-glyph').forEach(glyph => {
      glyph.style.fontFamily = f.family;
    });
  }

  document.querySelectorAll('.font-btn').forEach(btn => btn.addEventListener('click', () => {
    fontIndex = (fontIndex + 1) % FONT_PRESETS.length;
    applyFont(fontIndex);
  }));

  applyFont(fontIndex);

  // ---------- state ----------
  let VOCAB = [];        // active list's [Italian, English] pairs
  let currentListLabel = '';
  let gameSourceScreen = null; // screen to return to when "Back" is pressed in-game
  let direction = 'en2it'; // 'en2it': question in English, options in Italian (default) · 'it2en': reversed
  let optionCount = 4; // number of multiple-choice options shown per question: 4, 6, or 8
  let blackout = false; // recall mode: when true, options render as solid blocks until hovered
  let masterPool = []; // full pairs list for the active topic, used to draw multiple-choice distractors from — stays full-size even during "Retry mistakes" so the option count never shrinks
  let currentAtoZMode = false; // true for "A to Z" (both full and Random Casuale): sequential (non-shuffled) play order, direction forced to IT->EN, and the dir-btn hidden
  let currentShowAzLetterBtn = false; // true only for "A to Z" full-list mode: swaps the dir-btn for az-letter-btn on the game screen
  let queue = [];        // shuffled (or, for A to Z, sequential) indices into VOCAB, not yet answered
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
  const screenFoodDrink = document.getElementById('screen-food-drink');
  const screenTravelVehicles = document.getElementById('screen-travel-vehicles');
  const screenAnimals   = document.getElementById('screen-animals');
  const screenAtoZ      = document.getElementById('screen-a-to-z');
  const screenGame      = document.getElementById('screen-game');
  const screenEnd       = document.getElementById('screen-end');
  const screenAbout     = document.getElementById('screen-about');

  function showScreen(el) {
    [screenStart, screenType, screenMenu, screenVocab, screenHousehold, screenFoodDrink, screenTravelVehicles, screenAnimals, screenAtoZ, screenGame, screenEnd, screenAbout].forEach(s => s.classList.add('hidden'));
    el.classList.remove('hidden');
  }

  document.getElementById('btn-goto-menu').addEventListener('click', () => showScreen(screenType));
  document.getElementById('btn-goto-about').addEventListener('click', () => showScreen(screenAbout));
  document.getElementById('type-item-verbs').addEventListener('click', () => showScreen(screenMenu));
  document.getElementById('type-item-vocab').addEventListener('click', () => showScreen(screenVocab));
  document.getElementById('type-item-atoz').addEventListener('click', () => showScreen(screenAtoZ));
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

  // "Random (Casuale)" isn't a fixed list — build a fresh 30-word draw from
  // every household sub-category, re-shuffled each time it's played.
  document.getElementById('menu-item-hh-random').addEventListener('click', () => startRandomHousehold());

  // "Food and drink (Cibo e bevande)" is a category, not a quiz — it
  // navigates one level deeper to screen-food-drink rather than calling
  // startGame.
  document.getElementById('menu-item-food-drink-category').addEventListener('click', () => showScreen(screenFoodDrink));
  document.getElementById('btn-back-vocab-from-food-drink').addEventListener('click', () => showScreen(screenVocab));

  document.getElementById('menu-item-fd-barbeque').addEventListener('click', () => startGame('barbeque', screenFoodDrink, FOOD_DRINK_LISTS));
  document.getElementById('menu-item-fd-breakfast').addEventListener('click', () => startGame('breakfast', screenFoodDrink, FOOD_DRINK_LISTS));
  document.getElementById('menu-item-fd-dessert-sweets').addEventListener('click', () => startGame('dessertSweets', screenFoodDrink, FOOD_DRINK_LISTS));
  document.getElementById('menu-item-fd-drinks').addEventListener('click', () => startGame('drinks', screenFoodDrink, FOOD_DRINK_LISTS));
  document.getElementById('menu-item-fd-fruit-vegetables').addEventListener('click', () => startGame('fruitVegetables', screenFoodDrink, FOOD_DRINK_LISTS));
  document.getElementById('menu-item-fd-lunch-dinner').addEventListener('click', () => startGame('lunchDinner', screenFoodDrink, FOOD_DRINK_LISTS));
  document.getElementById('menu-item-fd-meat').addEventListener('click', () => startGame('meat', screenFoodDrink, FOOD_DRINK_LISTS));

  // "Random (Casuale)" isn't a fixed list — build a fresh 30-word draw from
  // every Food & Drink sub-category, re-shuffled each time it's played.
  document.getElementById('menu-item-fd-random').addEventListener('click', () => startRandomFoodDrink());

  // "Travel and vehicles (Viaggi e veicoli)" is a category, not a quiz —
  // it navigates one level deeper to screen-travel-vehicles rather than
  // calling startGame.
  document.getElementById('menu-item-travel-vehicles-category').addEventListener('click', () => showScreen(screenTravelVehicles));
  document.getElementById('btn-back-vocab-from-travel-vehicles').addEventListener('click', () => showScreen(screenVocab));

  document.getElementById('menu-item-tv-travel').addEventListener('click', () => startGame('travel', screenTravelVehicles, TRAVEL_VEHICLES_LISTS));
  document.getElementById('menu-item-tv-vehicles').addEventListener('click', () => startGame('vehicles', screenTravelVehicles, TRAVEL_VEHICLES_LISTS));

  // "Random (Casuale)" isn't a fixed list — build a fresh 30-word draw from
  // both Travel and Vehicles pooled together, re-shuffled each time it's
  // played.
  document.getElementById('menu-item-tv-random').addEventListener('click', () => startRandomTravelVehicles());

  // "Animals (Gli animali)" is a category, not a quiz — it navigates one
  // level deeper to screen-animals rather than calling startGame.
  document.getElementById('menu-item-animals-category').addEventListener('click', () => showScreen(screenAnimals));
  document.getElementById('btn-back-vocab-from-animals').addEventListener('click', () => showScreen(screenVocab));

  document.getElementById('menu-item-an-animals').addEventListener('click', () => startGame('animals', screenAnimals, ANIMALS_LISTS));
  document.getElementById('menu-item-an-baby-animals').addEventListener('click', () => startGame('babyAnimals', screenAnimals, ANIMALS_LISTS));
  document.getElementById('menu-item-an-birds').addEventListener('click', () => startGame('birds', screenAnimals, ANIMALS_LISTS));
  document.getElementById('menu-item-an-bugs').addEventListener('click', () => startGame('bugs', screenAnimals, ANIMALS_LISTS));
  document.getElementById('menu-item-an-fish-sealife').addEventListener('click', () => startGame('fishSealife', screenAnimals, ANIMALS_LISTS));
  document.getElementById('menu-item-an-pets').addEventListener('click', () => startGame('pets', screenAnimals, ANIMALS_LISTS));

  // "Random (Casuale)" isn't a fixed list — build a fresh 30-word draw from
  // every Animals sub-category pooled together, re-shuffled each time it's
  // played.
  document.getElementById('menu-item-an-random').addEventListener('click', () => startRandomAnimals());

  // "A to Z" sits directly under screen-type (like Verbs/Vocabulary), and
  // itself has two modes rather than sub-category tiles: the full
  // alphabetical list, and a random 30-word draw that's still presented
  // alphabetically (see startAtoZFull() / startRandomAtoZ() below).
  document.getElementById('btn-back-start-from-a-to-z').addEventListener('click', () => showScreen(screenType));
  document.getElementById('menu-item-atoz-full').addEventListener('click', () => {
    azLetterIdx = 0; // always start a fresh "A to Z" run at ALL; the
                      // letter is then chosen in-game via az-letter-btn.
    startAtoZFull();
  });
  document.getElementById('menu-item-atoz-random').addEventListener('click', () => startRandomAtoZ());

  // Every Home button does the exact same thing everywhere, so — like
  // the scheme/font toggles above — it's wired once via its shared
  // class rather than once per screen.
  document.querySelectorAll('.home-btn').forEach(btn => btn.addEventListener('click', () => showScreen(screenStart)));

  // Back buttons go to a different screen depending which screen
  // they're on, so each is wired individually here — mirroring exactly
  // where that same screen's existing full-width "Back" button goes.
  // The start screen's Back button is disabled (nothing to go back to
  // from the very first screen), so it has no listener.
  document.getElementById('type-back-btn').addEventListener('click', () => showScreen(screenStart));
  document.getElementById('menu-back-btn').addEventListener('click', () => showScreen(screenType));
  document.getElementById('vocab-back-btn').addEventListener('click', () => showScreen(screenType));
  document.getElementById('household-back-btn').addEventListener('click', () => showScreen(screenVocab));
  document.getElementById('food-drink-back-btn').addEventListener('click', () => showScreen(screenVocab));
  document.getElementById('travel-vehicles-back-btn').addEventListener('click', () => showScreen(screenVocab));
  document.getElementById('animals-back-btn').addEventListener('click', () => showScreen(screenVocab));
  document.getElementById('a-to-z-back-btn').addEventListener('click', () => showScreen(screenType));
  document.getElementById('game-back-btn').addEventListener('click', () => showScreen(gameSourceScreen || screenType));
  document.getElementById('end-back-btn').addEventListener('click', () => showScreen(gameSourceScreen || screenType));
  document.getElementById('about-back-btn').addEventListener('click', () => showScreen(screenStart));
  document.getElementById('btn-back-start-from-about').addEventListener('click', () => showScreen(screenStart));

  function questionLangIdx() { return currentAtoZMode ? 0 : (direction === 'it2en' ? 0 : 1); } // index into a [Italian, English] pair used for the question — A to Z always asks the Italian word
  function optionLangIdx()   { return currentAtoZMode ? 1 : (direction === 'it2en' ? 1 : 0); } // index used for the multiple-choice options — A to Z always answers in English

  function updateDirButtons() {
    const label = direction === 'it2en' ? 'IT → EN' : 'EN → IT';
    document.querySelectorAll('.dir-btn').forEach(btn => btn.textContent = label);
  }
  document.querySelectorAll('.dir-btn').forEach(btn => btn.addEventListener('click', () => {
    direction = direction === 'it2en' ? 'en2it' : 'it2en';
    updateDirButtons();
  }));
  updateDirButtons();

  // ---------- A to Z letter-cycle toggle ----------
  // Only shown in-game, and only during "A to Z" full-list play — it takes
  // the EN<->IT direction toggle's place there (direction doesn't apply to
  // A-to-Z's fixed alphabetical order), cycling ALL -> A -> B -> ... -> Z.
  // Built from whatever first letters actually appear in VOCAB_A_TO_Z, so
  // it stays correct automatically if new letters are ever added.
  const azLetters = ['ALL', ...Array.from(new Set(VOCAB_A_TO_Z.map(p => p[0][0].toUpperCase()))).sort()];
  let azLetterIdx = 0;
  const azLetterBtn = document.getElementById('az-letter-btn');

  function updateAzLetterButton() {
    azLetterBtn.textContent = azLetters[azLetterIdx];
  }
  azLetterBtn.addEventListener('click', () => {
    // Changing the letter mid-round restarts the round scoped to the new
    // letter (own confirmed behaviour) — startAtoZFull() rebuilds
    // everything (queue, totalQuestions, progress text) from scratch.
    azLetterIdx = (azLetterIdx + 1) % azLetters.length;
    updateAzLetterButton();
    startAtoZFull();
  });
  updateAzLetterButton();

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
    startGameWithPairs(list.pairs, list.label, list.footer, sourceScreen, list.pairs, false, false);
  }

  // Builds a fresh 30-pair "Random (Casuale)" round by pooling every
  // household sub-category together and shuffling. Runs again from scratch
  // each time the tile is clicked, so a new draw appears every play.
  // masterPool is the FULL household pool (every sub-category, not just
  // the 30 drawn here) so multiple-choice distractors can come from any
  // household word, not only the ones in this particular round.
  function startRandomHousehold() {
    const allHouseholdPairs = Object.values(HOUSEHOLD_LISTS).flatMap(list => list.pairs);
    const randomPairs = shuffle(allHouseholdPairs).slice(0, 30);
    const label = 'Random (Casuale)';
    const footer = label + ' · ' + randomPairs.length + ' pairs';
    startGameWithPairs(randomPairs, label, footer, screenHousehold, allHouseholdPairs, false, false);
  }

  // Same idea as startRandomHousehold(), but pools every Food & Drink
  // sub-category instead. masterPool is the FULL Food & Drink pool, so
  // distractors can come from any Food & Drink word, not just this
  // round's 30.
  function startRandomFoodDrink() {
    const allFoodDrinkPairs = Object.values(FOOD_DRINK_LISTS).flatMap(list => list.pairs);
    const randomPairs = shuffle(allFoodDrinkPairs).slice(0, 30);
    const label = 'Random (Casuale)';
    const footer = label + ' · ' + randomPairs.length + ' pairs';
    startGameWithPairs(randomPairs, label, footer, screenFoodDrink, allFoodDrinkPairs, false, false);
  }

  // Same idea as startRandomHousehold() / startRandomFoodDrink(), but pools
  // Travel and Vehicles together. masterPool is the FULL Travel & Vehicles
  // pool, so distractors can come from any word in either sub-category,
  // not just this round's 30.
  function startRandomTravelVehicles() {
    const allTravelVehiclesPairs = Object.values(TRAVEL_VEHICLES_LISTS).flatMap(list => list.pairs);
    const randomPairs = shuffle(allTravelVehiclesPairs).slice(0, 30);
    const label = 'Random (Casuale)';
    const footer = label + ' · ' + randomPairs.length + ' pairs';
    startGameWithPairs(randomPairs, label, footer, screenTravelVehicles, allTravelVehiclesPairs, false, false);
  }

  // Same idea as the other category Random modes, but pools every Animals
  // sub-category together. masterPool is the FULL Animals pool, so
  // distractors can come from any Animals word, not just this round's 30.
  function startRandomAnimals() {
    const allAnimalsPairs = Object.values(ANIMALS_LISTS).flatMap(list => list.pairs);
    const randomPairs = shuffle(allAnimalsPairs).slice(0, 30);
    const label = 'Random (Casuale)';
    const footer = label + ' · ' + randomPairs.length + ' pairs';
    startGameWithPairs(randomPairs, label, footer, screenAnimals, allAnimalsPairs, false, false);
  }

  // "A to Z" full mode: plays VOCAB_A_TO_Z (or just the slice starting with
  // whichever letter az-letter-btn currently shows) in the exact order the
  // pairs appear in vocab-a-to-z.js — never shuffled, since the point of
  // "A to Z" is working straight through it alphabetically. Re-entering
  // this — from the menu tile, or by clicking az-letter-btn in-game —
  // always restarts the round from question 1, scoped to whatever letter
  // is now selected.
  function startAtoZFull() {
    const letter = azLetters[azLetterIdx];
    const pairs = letter === 'ALL'
      ? VOCAB_A_TO_Z
      : VOCAB_A_TO_Z.filter(p => p[0][0].toUpperCase() === letter);
    const label = 'A to Z' + (letter === 'ALL' ? '' : ' - ' + letter);
    const footer = label + ' · ' + pairs.length + ' pairs';
    startGameWithPairs(pairs, label, footer, screenAtoZ, pairs, true, true);
  }

  // "A to Z" Random (Casuale): draws a fresh random 30-word sample from the
  // full A-to-Z list each time it's played, then sorts that sample back
  // into alphabetical order before play — the SELECTION is random, but
  // (unlike every other Random mode) the playthrough order still isn't.
  // masterPool is the FULL 643-word A-to-Z list, so distractors can come
  // from any A-to-Z word, not just this round's 30. az-letter-btn doesn't
  // apply here, so showAzLetterBtn stays false.
  function startRandomAtoZ() {
    const randomPairs = shuffle(VOCAB_A_TO_Z).slice(0, 30)
      .sort((a, b) => a[0].localeCompare(b[0], 'it'));
    const label = 'A to Z - Random (Casuale)';
    const footer = label + ' · ' + randomPairs.length + ' pairs';
    startGameWithPairs(randomPairs, label, footer, screenAtoZ, VOCAB_A_TO_Z, true, false);
  }

  function startGameWithPairs(pairs, label, footer, sourceScreen, pool, noShuffle, showAzLetterBtn) {
    VOCAB = pairs;
    currentListLabel = label;
    totalQuestions = VOCAB.length;
    gameSourceScreen = sourceScreen || screenType;
    masterPool = pool || pairs;
    currentAtoZMode = !!noShuffle;
    currentShowAzLetterBtn = !!showAzLetterBtn;
    document.getElementById('game-footer-note').textContent = footer;
    const indices = [...Array(VOCAB.length).keys()];
    // nextQuestion() takes questions off the END of queue via .pop(), so a
    // sequential (non-shuffled) play order needs the indices reversed —
    // that way index 0 is the first one popped.
    queue = currentAtoZMode ? indices.reverse() : shuffle(indices);
    correctCount = 0;
    wrongCount = 0;
    wrongAnswers = [];
    // A to Z's direction is always forced (Italian question, English
    // answers — see questionLangIdx()/optionLangIdx()), so the EN<->IT
    // toggle doesn't apply and is hidden for BOTH A-to-Z modes. The
    // letter-cycle button takes its place, but only for the full-list
    // mode (Random Casuale has no letter to pick).
    document.querySelectorAll('#screen-game .dir-btn').forEach(btn => btn.classList.toggle('hidden', currentAtoZMode));
    azLetterBtn.classList.toggle('hidden', !currentShowAzLetterBtn);
    if (currentShowAzLetterBtn) updateAzLetterButton();
    showScreen(screenGame);
    nextQuestion();
  }

  document.getElementById('btn-retry-mistakes').addEventListener('click', () => {
    if (wrongAnswers.length === 0) return;
    const pairs = wrongAnswers.slice();
    const baseLabel = currentListLabel.replace(/ — Retry mistakes$/, '');
    const label = baseLabel + ' — Retry mistakes';
    const footer = label + ' · ' + pairs.length + ' pairs';
    startGameWithPairs(pairs, label, footer, gameSourceScreen, masterPool, currentAtoZMode, currentShowAzLetterBtn);
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
    // Exposed as a data attribute purely so style.css can lay out 6- and
    // 8-option questions differently from 4 on narrow screens (a long
    // single column of 8 answers is a lot of scrolling on a phone) —
    // this line is the only thing tying game logic to that CSS choice.
    grid.dataset.count = String(optionCount);
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

  // ---------- grade tiers & motivational comments ----------
  // Each tier has a display "letter" (shown big in #grade-letter) and a pool
  // of 5 motivational comments; endGame() picks one at random each time and
  // shows it in #grade-comment, between the grade and the score line.
  const GRADE_TIERS = {
    perfect: {
      letter: '100%!',
      comments: [
        'Assoluta perfezione, you are truly fantastico!',
        'Every single answer was perfetto - well done!',
        'Flawless work, hai capito everything completely!',
        'Incredible job, a perfetto score!',
        'Outshining everyone with a meravigliosa performance!',
      ],
    },
    aStar: {
      letter: 'A*',
      comments: [
        'Exceptional work, you aced this test, bravissimo!',
        'Brilliant performance, keep shining bright always!',
        'Outstanding effort, you hit the highest mark!',
        'Top-tier mastery, you should be so fiero!',
        'Phenomenal results, keep up the brilliance!',
      ],
    },
    a: {
      letter: 'A',
      comments: [
        'Fantastico job, your hard work really paid off!',
        'Superb effort, you are doing wonderfully, benissimo!',
        'Wonderful results, keep up this great slancio!',
        'Brilliant understanding shown here, ottimo lavoro!',
        'Impressive work, you are right at the top!',
      ],
    },
    b: {
      letter: 'B',
      comments: [
        'Very solido performance, keep up the good work!',
        'Great effort, you are doing davvero well!',
        'Strong work, you have a fermo grasp of this!',
        'You are performing consistently well, avanti così!',
        'Good job, your progress is shining through!',
      ],
    },
    c: {
      letter: 'C',
      comments: [
        'Good steady effort, you are meeting expectations!',
        'Solido work, keep building on this foundation!',
        'You are doing bene, keep pushing forward!',
        'Good progress shown here, continue così!',
        'A respectable result, keep up the steady work!',
      ],
    },
    d: {
      letter: 'D',
      comments: [
        'You are making progress, prova ancora!',
        'Keep practicing and you will see miglioramento!',
        'Good effort, keep working hard each giorno!',
        'You can do this, just keep practicing!',
        'Every step forward counts, non mollare!',
      ],
    },
    e: {
      letter: 'E',
      comments: [
        'Keep your chin up, stai improving!',
        'More practice will help you improve steadily!',
        "Don't give up, you are moving avanti!",
        'Keep trying, ogni bit of practice helps!',
        'Every expert was once a beginner, dai!',
      ],
    },
  };

  // Bands: 100% exact -> perfect; 90-99 -> A*; 80-89 -> A; 70-79 -> B;
  // 55-69 -> C; 35-54 -> D; 0-34 -> E. No "F" tier any more.
  function getGradeInfo(pct) {
    if (pct >= 100) return GRADE_TIERS.perfect;
    if (pct >= 90) return GRADE_TIERS.aStar;
    if (pct >= 80) return GRADE_TIERS.a;
    if (pct >= 70) return GRADE_TIERS.b;
    if (pct >= 55) return GRADE_TIERS.c;
    if (pct >= 35) return GRADE_TIERS.d;
    return GRADE_TIERS.e;
  }

  function endGame() {
    const pct = Math.round((correctCount / totalQuestions) * 1000) / 10;
    const gradeInfo = getGradeInfo(pct);
    const comment = gradeInfo.comments[Math.floor(Math.random() * gradeInfo.comments.length)];
    document.getElementById('grade-letter').textContent = gradeInfo.letter;
    document.getElementById('grade-comment').textContent = comment;
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
