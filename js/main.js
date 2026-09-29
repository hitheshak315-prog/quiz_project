/**
 * QuizNest - Main Home Page Script
 * Manages username prompts, dynamic test launches, category filtering,
 * and quick performance preview.
 */

document.addEventListener('DOMContentLoaded', () => {
  initUsernameDisplay();
  initModalListeners();
  initHeroStats();
  initTestButtons();
});

// Pending test configuration before username is confirmed
let pendingTestConfig = null;

/**
 * Initializes and displays the current user's name across the navbar and greeting
 */
function initUsernameDisplay() {
  const currentUsername = Storage.getUsername();
  const navUserContainer = document.getElementById('navUserBadge');
  const heroGreeting = document.getElementById('heroUserGreeting');

  if (currentUsername) {
    if (navUserContainer) {
      navUserContainer.innerHTML = `
        <span class="user-avatar">${currentUsername.charAt(0).toUpperCase()}</span>
        <span>${escapeHtml(currentUsername)}</span>
        <button class="btn-change-user" id="btnChangeUser" title="Switch User">Change</button>
      `;
      document.getElementById('btnChangeUser')?.addEventListener('click', () => {
        openUsernameModal(false);
      });
    }
    if (heroGreeting) {
      heroGreeting.textContent = `Welcome back, ${currentUsername}! Ready for your next challenge?`;
    }
  } else {
    if (navUserContainer) {
      navUserContainer.innerHTML = `
        <button class="btn btn-sm btn-outline" id="btnNavLogin">
          👤 Enter Name
        </button>
      `;
      document.getElementById('btnNavLogin')?.addEventListener('click', () => {
        openUsernameModal(false);
      });
    }
    if (heroGreeting) {
      heroGreeting.textContent = `Welcome to QuizNest! Test your knowledge across all difficulty levels.`;
    }
  }
}

/**
 * Modal management for username entry
 */
function initModalListeners() {
  const modalOverlay = document.getElementById('usernameModal');
  const inputUsername = document.getElementById('usernameInput');
  const btnSubmit = document.getElementById('btnSaveUsername');
  const btnCancel = document.getElementById('btnCancelUsername');
  const errorMsg = document.getElementById('usernameError');

  if (!modalOverlay) return;

  btnSubmit?.addEventListener('click', () => {
    const name = inputUsername.value.trim();
    if (!name) {
      errorMsg.textContent = 'Please enter your name to continue.';
      errorMsg.style.display = 'block';
      inputUsername.focus();
      return;
    }

    Storage.setUsername(name);
    modalOverlay.classList.remove('active');
    initUsernameDisplay();

    // If a test was queued, start it now
    if (pendingTestConfig) {
      launchTest(pendingTestConfig);
      pendingTestConfig = null;
    }
  });

  inputUsername?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnSubmit.click();
    }
  });

  btnCancel?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    pendingTestConfig = null;
  });
}

function openUsernameModal(isStartingTest = false) {
  const modalOverlay = document.getElementById('usernameModal');
  const inputUsername = document.getElementById('usernameInput');
  const errorMsg = document.getElementById('usernameError');

  if (errorMsg) errorMsg.style.display = 'none';
  if (inputUsername) {
    inputUsername.value = Storage.getUsername() || '';
  }
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    setTimeout(() => inputUsername?.focus(), 100);
  }
}

/**
 * Configure buttons across Difficulty cards, Hero CTA, and Categories
 */
function initTestButtons() {
  // Hero CTA
  document.getElementById('heroStartBtn')?.addEventListener('click', () => {
    promptAndStartTest({ difficulty: 'easy', category: 'all' });
  });

  // Difficulty Cards
  document.getElementById('btnStartEasy')?.addEventListener('click', () => {
    promptAndStartTest({ difficulty: 'easy', category: 'all' });
  });

  document.getElementById('btnStartMedium')?.addEventListener('click', () => {
    promptAndStartTest({ difficulty: 'medium', category: 'all' });
  });

  document.getElementById('btnStartHard')?.addEventListener('click', () => {
    promptAndStartTest({ difficulty: 'hard', category: 'all' });
  });

  // Category Cards
  document.querySelectorAll('[data-category-test]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = btn.getAttribute('data-category-test');
      const difficulty = btn.getAttribute('data-difficulty') || 'medium';
      promptAndStartTest({ difficulty, category });
    });
  });
}

/**
 * Check if username exists before launching test. If not, prompt modal.
 */
function promptAndStartTest(config) {
  if (!Storage.hasUsername()) {
    pendingTestConfig = config;
    openUsernameModal(true);
  } else {
    launchTest(config);
  }
}

/**
 * Prepares the test state and redirects to quiz.html
 */
function launchTest(config) {
  const { difficulty, category } = config;
  
  // Set default time limits based on difficulty
  // Easy: 5 mins, Medium: 7 mins, Hard: 10 mins
  let timeLimitMinutes = 5;
  if (difficulty === 'medium') timeLimitMinutes = 7;
  if (difficulty === 'hard') timeLimitMinutes = 10;

  const testConfig = {
    difficulty: difficulty || 'easy',
    category: category || 'all',
    totalQuestions: 10,
    timeLimitMinutes: timeLimitMinutes,
    timeRemainingSeconds: timeLimitMinutes * 60,
    startTime: Date.now()
  };

  Storage.saveActiveTest(testConfig);
  window.location.href = 'quiz.html';
}

/**
 * Show high-level stats in Hero if user already has attempts
 */
function initHeroStats() {
  const history = Storage.getHistory();
  const statCompleted = document.getElementById('statTotalCompleted');
  const statAvg = document.getElementById('statAvgScore');
  const statBest = document.getElementById('statBestScore');

  if (statCompleted) statCompleted.textContent = history.length;

  if (history.length > 0) {
    const totalScore = history.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    const avg = Math.round(totalScore / history.length);
    const best = Math.max(...history.map(h => h.percentage || 0));

    if (statAvg) statAvg.textContent = `${avg}%`;
    if (statBest) statBest.textContent = `${best}%`;
  }
}

// Helper: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
