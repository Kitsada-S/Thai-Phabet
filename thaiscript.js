'use strict';

const CONSONANTS = [
  { glyph: 'ก', phonetic: 'Ko Kai' },
  { glyph: 'ข', phonetic: 'Kho Khai' },
  { glyph: 'ฃ', phonetic: 'Kho Khuat' },
  { glyph: 'ค', phonetic: 'Kho Khwai' },
  { glyph: 'ฅ', phonetic: 'Kho Khon' },
  { glyph: 'ฆ', phonetic: 'Kho Rakhang' },
  { glyph: 'ง', phonetic: 'Ngo Ngu' },
  { glyph: 'จ', phonetic: 'Cho Chan' },
  { glyph: 'ฉ', phonetic: 'Cho Ching' },
  { glyph: 'ช', phonetic: 'Cho Chang' },
  { glyph: 'ซ', phonetic: 'So So' },
  { glyph: 'ฌ', phonetic: 'Cho Choe' },
  { glyph: 'ญ', phonetic: 'Yo Ying' },
  { glyph: 'ฎ', phonetic: 'Do Chada' },
  { glyph: 'ฏ', phonetic: 'To Patak' },
  { glyph: 'ฐ', phonetic: 'Tho Than' },
  { glyph: 'ฑ', phonetic: 'Tho Montho' },
  { glyph: 'ฒ', phonetic: 'Tho Phuthao' },
  { glyph: 'ณ', phonetic: 'No Nen' },
  { glyph: 'ด', phonetic: 'Do Dek' },
  { glyph: 'ต', phonetic: 'To Tao' },
  { glyph: 'ถ', phonetic: 'Tho Thung' },
  { glyph: 'ท', phonetic: 'Tho Thahan' },
  { glyph: 'ธ', phonetic: 'Tho Thong' },
  { glyph: 'น', phonetic: 'No Nu' },
  { glyph: 'บ', phonetic: 'Bo Baimai' },
  { glyph: 'ป', phonetic: 'Po Pla' },
  { glyph: 'ผ', phonetic: 'Pho Phueng' },
  { glyph: 'ฝ', phonetic: 'Fo Fa' },
  { glyph: 'พ', phonetic: 'Pho Phan' },
  { glyph: 'ฟ', phonetic: 'Fo Fan' },
  { glyph: 'ภ', phonetic: 'Pho Samphao' },
  { glyph: 'ม', phonetic: 'Mo Ma' },
  { glyph: 'ย', phonetic: 'Yo Yak' },
  { glyph: 'ร', phonetic: 'Ro Ruea' },
  { glyph: 'ล', phonetic: 'Lo Ling' },
  { glyph: 'ว', phonetic: 'Wo Waen' },
  { glyph: 'ศ', phonetic: 'So Sala' },
  { glyph: 'ษ', phonetic: 'So Ruesi' },
  { glyph: 'ส', phonetic: 'So Suea' },
  { glyph: 'ห', phonetic: 'Ho Hip' },
  { glyph: 'ฬ', phonetic: 'Lo Chula' },
  { glyph: 'อ', phonetic: 'O Ang' },
  { glyph: 'ฮ', phonetic: 'Ho Nokhuk' },
];

const state = {
  shuffledIndices: [],
  currentQuestion: 0,
  results: [],          // array of booleans, one per answered question
  selectedChoice: null, // index 0–2 of currently selected MCQ option
  choices: [],          // array of { phonetic, correct } for current question
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initGame() {
  state.shuffledIndices = shuffle([...Array(44).keys()]);
  state.currentQuestion = 0;
  state.results = [];
  state.selectedChoice = null;
  state.choices = [];
  renderScoreboard();
  renderQuestion();
}

function renderScoreboard() {
  const container = document.getElementById('scoreboard-points');
  container.innerHTML = '';

  for (let i = 0; i < 44; i++) {
    const sphere = document.createElement('div');
    sphere.className = 'point-sphere';

    if (i < state.currentQuestion) {
      sphere.classList.add(state.results[i] ? 'point-sphere--correct' : 'point-sphere--incorrect');
    } else if (i === state.currentQuestion) {
      sphere.classList.add('point-sphere--active');
    } else {
      sphere.classList.add('point-sphere--inactive');
    }

    container.appendChild(sphere);
  }

  document.getElementById('question-counter').textContent =
    `${state.currentQuestion + 1} / 44 Consonants`;
}

function renderQuestion() {
  const consonantIndex = state.shuffledIndices[state.currentQuestion];
  const consonant = CONSONANTS[consonantIndex];

  // Display the Thai glyph
  const glyphDisplay = document.getElementById('glyph-display');
  glyphDisplay.innerHTML = `<span class="glyph-char">${consonant.glyph}</span>`;

  // Pick 2 wrong answers from the other 43 consonants.
  // Previously-seen consonants are included in the pool as specified.
  const otherIndices = [...Array(44).keys()].filter(i => i !== consonantIndex);
  const [wrong1, wrong2] = shuffle(otherIndices);

  state.choices = shuffle([
    { phonetic: consonant.phonetic, correct: true },
    { phonetic: CONSONANTS[wrong1].phonetic, correct: false },
    { phonetic: CONSONANTS[wrong2].phonetic, correct: false },
  ]);
  state.selectedChoice = null;

  const buttons = document.querySelectorAll('.button-choice');
  buttons.forEach((btn, i) => {
    btn.querySelector('.choice').textContent = state.choices[i].phonetic;
    btn.className = 'button-choice';
  });
}

function selectChoice(index) {
  state.selectedChoice = index;
  document.querySelectorAll('.button-choice').forEach((btn, i) => {
    btn.classList.toggle('button-choice--selected', i === index);
  });
}

function validate() {
  if (state.selectedChoice === null) return;

  const isCorrect = state.choices[state.selectedChoice].correct;
  state.results.push(isCorrect);
  state.currentQuestion++;

  if (state.currentQuestion >= 44) {
    showResult();
    return;
  }

  renderScoreboard();
  renderQuestion();
}

function showResult() {
  // Populate the result scoreboard dots (all 44 answered)
  const resultPoints = document.getElementById('result-points');
  resultPoints.innerHTML = '';
  for (let i = 0; i < 44; i++) {
    const sphere = document.createElement('div');
    sphere.className = `point-sphere ${state.results[i] ? 'point-sphere--correct' : 'point-sphere--incorrect'}`;
    resultPoints.appendChild(sphere);
  }
  document.getElementById('result-counter').textContent = '44 / 44 Consonants';

  // Build the 6×8 result grid (48 cells: 44 glyphs + 4 empty)
  const grid = document.getElementById('result-grid');
  grid.innerHTML = '';

  for (let i = 0; i < 48; i++) {
    const tile = document.createElement('div');
    tile.className = 'result-tile';

    if (i < 44) {
      // Find which quiz position this canonical consonant was asked at
      const quizPosition = state.shuffledIndices.indexOf(i);
      const isCorrect = state.results[quizPosition];
      tile.classList.add(isCorrect ? 'result-tile--correct' : 'result-tile--incorrect');
      tile.innerHTML = `<span class="result-tile-char">${CONSONANTS[i].glyph}</span>`;
    } else {
      tile.classList.add('result-tile--empty');
    }

    grid.appendChild(tile);
  }

  showScreen('result');
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('screen--hidden'));
  document.getElementById(`screen-${name}`).classList.remove('screen--hidden');
}

// ── Event listeners ────────────────────────────────────────

function startGame() {
  showScreen('quiz');
  initGame();
}

const splashTimer = setTimeout(startGame, 1500);

document.getElementById('screen-splash').addEventListener('click', () => {
  clearTimeout(splashTimer);
  startGame();
});

document.querySelectorAll('.button-choice').forEach((btn, i) => {
  btn.addEventListener('click', () => selectChoice(i));
});

document.getElementById('btn-validate').addEventListener('click', validate);

document.getElementById('btn-reset').addEventListener('click', () => {
  initGame();
});

document.getElementById('btn-play-again').addEventListener('click', () => {
  showScreen('quiz');
  initGame();
});

// ── PWA Service Worker registration ───────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
