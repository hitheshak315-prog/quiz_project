/**
 * QuizNest - Arcade & Interactive Quiz Games
 * Features:
 * 1. Web Dev 60-Second Speed Blitz (Rapid fire with score combos)
 * 2. Code Snippet Quest (Instant code output prediction)
 */

document.addEventListener('DOMContentLoaded', () => {
  GamesEngine.init();
});

const GamesEngine = {
  // Speed Blitz State
  blitzTimer: 60,
  blitzInterval: null,
  blitzScore: 0,
  blitzCombo: 1,
  blitzQuestions: [],
  currentBlitzIndex: 0,
  isBlitzRunning: false,

  init() {
    this.renderUserBadge();
    this.bindBlitzGame();
    this.bindCodeQuest();
    this.loadBlitzHighScore();
  },

  renderUserBadge() {
    const user = Storage.getUsername();
    const badgeEl = document.getElementById('navUserBadge');
    if (badgeEl && user) {
      badgeEl.innerHTML = `
        <span class="user-avatar">${user.charAt(0).toUpperCase()}</span>
        <span>${this.escapeHtml(user)}</span>
      `;
    }
  },

  loadBlitzHighScore() {
    const highScore = localStorage.getItem('quiznest_blitz_highscore') || 0;
    const hsEl = document.getElementById('blitzHighScore');
    if (hsEl) hsEl.textContent = highScore;
  },

  bindBlitzGame() {
    const btnStart = document.getElementById('btnStartBlitz');
    const btnRestart = document.getElementById('btnRestartBlitz');

    btnStart?.addEventListener('click', () => {
      this.startSpeedBlitz();
    });

    btnRestart?.addEventListener('click', () => {
      this.startSpeedBlitz();
    });
  },

  startSpeedBlitz() {
    this.isBlitzRunning = true;
    this.blitzTimer = 60;
    this.blitzScore = 0;
    this.blitzCombo = 1;
    this.currentBlitzIndex = 0;

    // Gather Web Dev questions from questions bank
    const webPool = [
      ...QUESTION_BANK.easy.filter(q => q.category === 'web_development'),
      ...QUESTION_BANK.medium.filter(q => q.category === 'web_development'),
      ...QUESTION_BANK.hard.filter(q => q.category === 'web_development')
    ];

    // Shuffle questions
    this.blitzQuestions = this.shuffle([...webPool]);

    // UI Updates
    document.getElementById('blitzIntro')?.style.setProperty('display', 'none');
    document.getElementById('blitzGameOver')?.style.setProperty('display', 'none');
    document.getElementById('blitzArena')?.style.setProperty('display', 'block');

    this.updateBlitzScoreUI();
    this.renderBlitzQuestion();

    if (this.blitzInterval) clearInterval(this.blitzInterval);
    this.blitzInterval = setInterval(() => {
      if (this.blitzTimer > 0) {
        this.blitzTimer--;
        const timerEl = document.getElementById('blitzCountdown');
        if (timerEl) timerEl.textContent = this.blitzTimer;
      } else {
        this.endSpeedBlitz();
      }
    }, 1000);
  },

  renderBlitzQuestion() {
    if (this.currentBlitzIndex >= this.blitzQuestions.length) {
      // Loop or re-shuffle if all answered
      this.blitzQuestions = this.shuffle([...this.blitzQuestions]);
      this.currentBlitzIndex = 0;
    }

    const q = this.blitzQuestions[this.currentBlitzIndex];
    const qEl = document.getElementById('blitzQuestionText');
    const optsEl = document.getElementById('blitzOptions');

    if (qEl) qEl.textContent = q.question;

    if (optsEl) {
      optsEl.innerHTML = '';
      const shuffledOpts = this.shuffle([...q.options]);

      shuffledOpts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline';
        btn.style.width = '100%';
        btn.style.padding = '14px';
        btn.style.fontSize = '1rem';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
          this.handleBlitzAnswer(btn, opt, q.answer);
        });

        optsEl.appendChild(btn);
      });
    }
  },

  handleBlitzAnswer(buttonEl, selected, correct) {
    if (!this.isBlitzRunning) return;

    const isCorrect = selected.trim() === correct.trim();

    if (isCorrect) {
      buttonEl.style.background = 'rgba(16, 185, 129, 0.4)';
      buttonEl.style.borderColor = 'var(--success)';
      this.blitzScore += 100 * this.blitzCombo;
      this.blitzCombo = Math.min(this.blitzCombo + 1, 5);
      this.playTone(600, 'sine', 0.1);
    } else {
      buttonEl.style.background = 'rgba(239, 68, 68, 0.4)';
      buttonEl.style.borderColor = 'var(--danger)';
      this.blitzCombo = 1;
      this.playTone(200, 'square', 0.15);
    }

    this.updateBlitzScoreUI();

    setTimeout(() => {
      this.currentBlitzIndex++;
      this.renderBlitzQuestion();
    }, 250);
  },

  updateBlitzScoreUI() {
    const scoreEl = document.getElementById('blitzLiveScore');
    const comboEl = document.getElementById('blitzCombo');

    if (scoreEl) scoreEl.textContent = this.blitzScore;
    if (comboEl) comboEl.textContent = `${this.blitzCombo}x`;
  },

  endSpeedBlitz() {
    clearInterval(this.blitzInterval);
    this.isBlitzRunning = false;

    // Check High Score
    const currentHigh = parseInt(localStorage.getItem('quiznest_blitz_highscore') || '0', 10);
    if (this.blitzScore > currentHigh) {
      localStorage.setItem('quiznest_blitz_highscore', this.blitzScore);
    }

    document.getElementById('blitzArena')?.style.setProperty('display', 'none');
    document.getElementById('blitzGameOver')?.style.setProperty('display', 'block');
    document.getElementById('blitzFinalScore').textContent = this.blitzScore;
    this.loadBlitzHighScore();
  },

  // Interactive Web Audio API sound synthesizer
  playTone(freq, type = 'sine', duration = 0.1) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  },

  // Code Snippet Quest Snippets
  bindCodeQuest() {
    const snippets = [
      {
        code: `console.log(1 + "2" + 3);`,
        options: ["'123'", "6", "'33'", "NaN"],
        answer: "'123'",
        desc: "String concatenation coerces 1 to '1', then '12' + 3 becomes '123'."
      },
      {
        code: `let x = [1, 2, 3];\nx.push(4);\nconsole.log(x.length);`,
        options: ["4", "3", "5", "undefined"],
        answer: "4",
        desc: "Array.push() appends an element and increases length by 1."
      },
      {
        code: `console.log(0.1 + 0.2 === 0.3);`,
        options: ["false", "true", "undefined", "TypeError"],
        answer: "false",
        desc: "Due to IEEE 754 binary floating-point representation, 0.1 + 0.2 is 0.30000000000000004."
      }
    ];

    let currentSnippetIdx = 0;
    const codeEl = document.getElementById('questCodeBlock');
    const optsEl = document.getElementById('questOptions');
    const descEl = document.getElementById('questExplanation');
    const btnNext = document.getElementById('btnNextQuest');

    function renderSnippet() {
      if (!codeEl || !optsEl) return;
      const item = snippets[currentSnippetIdx];
      codeEl.textContent = item.code;
      if (descEl) descEl.style.display = 'none';

      optsEl.innerHTML = '';
      item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline';
        btn.style.width = '100%';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
          if (opt === item.answer) {
            btn.style.background = 'rgba(16, 185, 129, 0.3)';
            btn.style.borderColor = 'var(--success)';
          } else {
            btn.style.background = 'rgba(239, 68, 68, 0.3)';
            btn.style.borderColor = 'var(--danger)';
          }
          if (descEl) {
            descEl.style.display = 'block';
            descEl.innerHTML = `<strong>Explanation:</strong> ${item.desc}`;
          }
        });

        optsEl.appendChild(btn);
      });
    }

    renderSnippet();

    btnNext?.addEventListener('click', () => {
      currentSnippetIdx = (currentSnippetIdx + 1) % snippets.length;
      renderSnippet();
    });
  },

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
