/**
 * QuizNest - Unified Dynamic Quiz Engine
 * Handles randomized question selection, shuffled options, navigation,
 * state persistence across questions, mark for review, real-time status palette,
 * countdown timer with automatic submission, and result computation.
 */

document.addEventListener('DOMContentLoaded', () => {
  QuizEngine.init();
});

const QuizEngine = {
  config: null,
  questions: [],
  currentIndex: 0,
  userAnswers: {},       // { [questionIndex]: "Selected Option String" }
  markedForReview: {},   // { [questionIndex]: true / false }
  timerInterval: null,
  timeRemaining: 0,
  totalTimeSeconds: 0,
  isSubmitted: false,

  init() {
    // 1. Verify username
    if (!Storage.hasUsername()) {
      window.location.href = 'index.html';
      return;
    }

    // 2. Load active test configuration
    const activeTest = Storage.getActiveTest();
    if (!activeTest) {
      window.location.href = 'index.html';
      return;
    }

    this.config = activeTest;

    // 3. Prepare or resume questions
    if (this.config.preparedQuestions && this.config.preparedQuestions.length > 0) {
      // Resume existing in-progress test
      this.questions = this.config.preparedQuestions;
      this.userAnswers = this.config.userAnswers || {};
      this.markedForReview = this.config.markedForReview || {};
      this.currentIndex = this.config.currentIndex || 0;
      this.timeRemaining = this.config.timeRemainingSeconds ?? (this.config.timeLimitMinutes * 60);
      this.totalTimeSeconds = this.config.timeLimitMinutes * 60;
    } else {
      // Initialize brand new randomized test
      this.prepareNewTestQuestions();
    }

    // 4. Update Header Badges & UI
    this.renderHeaderInfo();
    this.renderQuestionPalette();
    this.renderCurrentQuestion();

    // 5. Start Countdown Timer
    this.startTimer();

    // 6. Bind Event Listeners
    this.bindControls();
  },

  /**
   * Randomly selects questions from the question bank and shuffles options
   */
  prepareNewTestQuestions() {
    const rawBank = getQuestions(this.config.difficulty, this.config.category);
    
    // Shuffle the entire available pool
    const shuffledPool = this.shuffleArray([...rawBank]);

    // Select the requested number of questions (default 10)
    const targetCount = Math.min(this.config.totalQuestions || 10, shuffledPool.length);
    const selectedQuestions = shuffledPool.slice(0, targetCount);

    // Prepare each question with independently shuffled options
    this.questions = selectedQuestions.map((q, idx) => {
      const shuffledOptions = this.shuffleArray([...q.options]);
      return {
        id: q.id || `q_${idx}`,
        questionNumber: idx + 1,
        question: q.question,
        options: shuffledOptions,
        answer: q.answer, // Original correct answer text
        difficulty: q.difficulty || this.config.difficulty,
        category: q.category || this.config.category,
        explanation: q.explanation || 'No explanation provided.'
      };
    });

    this.totalTimeSeconds = (this.config.timeLimitMinutes || 5) * 60;
    this.timeRemaining = this.totalTimeSeconds;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.markedForReview = {};

    // Save prepared test structure to storage
    this.persistActiveState();
  },

  /**
   * Fisher-Yates Array Shuffle algorithm
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  /**
   * Persists the current state in localStorage to prevent loss on reload
   */
  persistActiveState() {
    this.config.preparedQuestions = this.questions;
    this.config.userAnswers = this.userAnswers;
    this.config.markedForReview = this.markedForReview;
    this.config.currentIndex = this.currentIndex;
    this.config.timeRemainingSeconds = this.timeRemaining;
    Storage.saveActiveTest(this.config);
  },

  /**
   * Renders the top test metadata (Title, Difficulty Badge, Question Count)
   */
  renderHeaderInfo() {
    const testTitleEl = document.getElementById('quizTestTitle');
    const badgeDiffEl = document.getElementById('quizDifficultyBadge');

    if (testTitleEl) {
      const categoryNames = {
        web_development: 'Web Development Test',
        computer_science: 'Computer Science Test',
        general_tech: 'General Tech & Aptitude',
        all: 'Comprehensive Mock Test'
      };
      testTitleEl.textContent = categoryNames[this.config.category] || 'Mock Test';
    }

    if (badgeDiffEl) {
      const diff = this.config.difficulty.toLowerCase();
      badgeDiffEl.className = `badge badge-${diff}`;
      badgeDiffEl.textContent = diff.toUpperCase();
    }
  },

  /**
   * Renders the current question, shuffled choices, and navigation states
   */
  renderCurrentQuestion() {
    if (!this.questions || this.questions.length === 0) return;

    const q = this.questions[this.currentIndex];
    const total = this.questions.length;

    // Question Progress and Counters
    const counterEl = document.getElementById('questionCounter');
    const progressFillEl = document.getElementById('quizProgressFill');
    const questionTextEl = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const btnMarkReview = document.getElementById('btnMarkReview');
    const prevBtn = document.getElementById('btnPrev');
    const nextBtn = document.getElementById('btnNext');
    const submitBtn = document.getElementById('btnSubmitTest');

    if (counterEl) {
      counterEl.textContent = `Question ${this.currentIndex + 1} of ${total}`;
    }

    if (progressFillEl) {
      const progressPercent = ((this.currentIndex + 1) / total) * 100;
      progressFillEl.style.width = `${progressPercent}%`;
    }

    if (questionTextEl) {
      questionTextEl.textContent = q.question;
    }

    // Mark for Review Button state
    const isMarked = !!this.markedForReview[this.currentIndex];
    if (btnMarkReview) {
      if (isMarked) {
        btnMarkReview.classList.add('marked');
        btnMarkReview.innerHTML = '⭐ Marked for Review';
      } else {
        btnMarkReview.classList.remove('marked');
        btnMarkReview.innerHTML = '☆ Mark for Review';
      }
    }

    // Render Options
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      const selectedValue = this.userAnswers[this.currentIndex];

      q.options.forEach((optText, idx) => {
        const isSelected = selectedValue === optText;
        const optCard = document.createElement('div');
        optCard.className = `option-item ${isSelected ? 'selected' : ''}`;
        optCard.setAttribute('data-option-index', idx);
        
        optCard.innerHTML = `
          <div class="option-letter">${letters[idx]}</div>
          <div class="option-label">${this.escapeHtml(optText)}</div>
        `;

        optCard.addEventListener('click', () => {
          this.selectOption(optText);
        });

        optionsContainer.appendChild(optCard);
      });
    }

    // Navigation buttons state
    if (prevBtn) {
      prevBtn.disabled = this.currentIndex === 0;
      prevBtn.style.opacity = this.currentIndex === 0 ? '0.4' : '1';
      prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
    }

    if (this.currentIndex === total - 1) {
      // Last question: Show Submit button prominently
      if (nextBtn) nextBtn.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
      if (nextBtn) nextBtn.style.display = 'inline-flex';
      if (submitBtn) submitBtn.style.display = 'none';
    }

    // Update Palette active states
    this.updatePaletteHighlights();
  },

  /**
   * Handles user selecting an answer choice
   */
  selectOption(optionText) {
    this.userAnswers[this.currentIndex] = optionText;
    this.persistActiveState();
    this.renderCurrentQuestion();
    this.updatePaletteHighlights();
  },

  /**
   * Clears the selected answer for the current question
   */
  clearCurrentChoice() {
    delete this.userAnswers[this.currentIndex];
    this.persistActiveState();
    this.renderCurrentQuestion();
    this.updatePaletteHighlights();
  },

  /**
   * Toggles the Mark for Review state for the current question
   */
  toggleMarkForReview() {
    this.markedForReview[this.currentIndex] = !this.markedForReview[this.currentIndex];
    this.persistActiveState();
    this.renderCurrentQuestion();
    this.updatePaletteHighlights();
  },

  /**
   * Moves to previous question
   */
  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.persistActiveState();
      this.renderCurrentQuestion();
    }
  },

  /**
   * Moves to next question
   */
  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.persistActiveState();
      this.renderCurrentQuestion();
    }
  },

  /**
   * Directly jumps to a specific question by index (0-based)
   */
  jumpToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      this.persistActiveState();
      this.renderCurrentQuestion();
    }
  },

  /**
   * Builds the Question Status Palette grid (1 to N)
   */
  renderQuestionPalette() {
    const paletteGrid = document.getElementById('paletteGrid');
    if (!paletteGrid) return;

    paletteGrid.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.id = `paletteBtn_${idx}`;
      btn.textContent = idx + 1;
      btn.title = `Jump to Question ${idx + 1}`;

      btn.addEventListener('click', () => {
        this.jumpToQuestion(idx);
      });

      paletteGrid.appendChild(btn);
    });

    this.updatePaletteHighlights();
  },

  /**
   * Updates visual indicators on the question palette
   */
  updatePaletteHighlights() {
    this.questions.forEach((q, idx) => {
      const btn = document.getElementById(`paletteBtn_${idx}`);
      if (!btn) return;

      const isAnswered = this.userAnswers[idx] !== undefined;
      const isMarked = !!this.markedForReview[idx];
      const isCurrent = this.currentIndex === idx;

      // Reset classes
      btn.className = 'palette-btn';

      if (isAnswered) btn.classList.add('answered');
      if (isMarked) btn.classList.add('marked');
      if (isCurrent) btn.classList.add('current');
    });

    // Update palette header summary counters
    const answeredCount = Object.keys(this.userAnswers).length;
    const reviewCount = Object.values(this.markedForReview).filter(Boolean).length;
    const summaryEl = document.getElementById('paletteSummary');
    if (summaryEl) {
      summaryEl.textContent = `${answeredCount}/${this.questions.length} Answered`;
    }
  },

  /**
   * Starts the countdown timer
   */
  startTimer() {
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        this.updateTimerDisplay();

        // Save periodically every 5 seconds
        if (this.timeRemaining % 5 === 0) {
          this.persistActiveState();
        }
      } else {
        // Time expired! Auto submit immediately without confirmation
        clearInterval(this.timerInterval);
        this.autoSubmitOnTimeout();
      }
    }, 1000);
  },

  /**
   * Updates timer display and pulses when under 60 seconds
   */
  updateTimerDisplay() {
    const timerBox = document.getElementById('timerBox');
    const timerText = document.getElementById('timerText');
    if (!timerText) return;

    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    timerText.textContent = formatted;

    if (timerBox) {
      if (this.timeRemaining <= 60) {
        timerBox.classList.add('timer-warning');
      } else {
        timerBox.classList.remove('timer-warning');
      }
    }
  },

  /**
   * Automatic submission when timer reaches 00:00
   */
  autoSubmitOnTimeout() {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    alert('Time has expired! Your test is being automatically submitted.');
    this.calculateAndCompleteResult();
  },

  /**
   * Manual submission with confirmation modal
   */
  promptSubmitConfirmation() {
    const modal = document.getElementById('submitModal');
    const summaryText = document.getElementById('submitModalSummary');
    if (!modal) {
      if (confirm('Are you sure you want to submit your test?')) {
        this.calculateAndCompleteResult();
      }
      return;
    }

    const total = this.questions.length;
    const answered = Object.keys(this.userAnswers).length;
    const marked = Object.values(this.markedForReview).filter(Boolean).length;
    const unanswered = total - answered;

    if (summaryText) {
      summaryText.innerHTML = `
        <strong>Test Summary:</strong><br>
        • Total Questions: ${total}<br>
        • Answered: <span style="color: var(--success); font-weight:700;">${answered}</span><br>
        • Unanswered: <span style="color: var(--warning); font-weight:700;">${unanswered}</span><br>
        • Marked for Review: <span style="color: var(--review-color); font-weight:700;">${marked}</span>
      `;
    }

    modal.classList.add('active');
  },

  /**
   * Calculates score, percentage, detailed review records,
   * saves to localStorage history and latest_result, and redirects to result.html
   */
  calculateAndCompleteResult() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isSubmitted = true;

    const username = Storage.getUsername();
    const totalQuestions = this.questions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    // Build question-by-question review items
    const reviewDetails = this.questions.map((q, idx) => {
      const userSelected = this.userAnswers[idx] || null;
      const isAnswered = userSelected !== null;
      const isCorrect = isAnswered && userSelected.trim() === q.answer.trim();
      const isMarked = !!this.markedForReview[idx];

      if (!isAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionNumber: idx + 1,
        question: q.question,
        options: q.options,
        userAnswer: userSelected,
        correctAnswer: q.answer,
        isCorrect: isCorrect,
        isAnswered: isAnswered,
        isMarked: isMarked,
        explanation: q.explanation
      };
    });

    const score = correctCount;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Compute time taken
    const timeTakenSeconds = Math.max(0, this.totalTimeSeconds - this.timeRemaining);
    const minutesTaken = Math.floor(timeTakenSeconds / 60);
    const secondsTaken = timeTakenSeconds % 60;
    const timeTakenFormatted = `${String(minutesTaken).padStart(2, '0')}:${String(secondsTaken).padStart(2, '0')}`;

    // Category display name
    const categoryDisplayNames = {
      web_development: 'Web Development',
      computer_science: 'Computer Science',
      general_tech: 'General Tech Aptitude',
      all: 'Comprehensive Mock Test'
    };

    const resultPayload = {
      id: `attempt_${Date.now()}`,
      username: username,
      category: this.config.category,
      categoryName: categoryDisplayNames[this.config.category] || 'Mock Test',
      difficulty: this.config.difficulty,
      score: score,
      totalQuestions: totalQuestions,
      percentage: percentage,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      unansweredCount: unansweredCount,
      timeTaken: timeTakenFormatted,
      timeTakenSeconds: timeTakenSeconds,
      date: new Date().toLocaleString(),
      reviewDetails: reviewDetails
    };

    // Save as latest result & store in historical attempts
    Storage.saveLatestResult(resultPayload);
    Storage.saveAttempt(resultPayload);

    // Clear active in-progress test
    Storage.clearActiveTest();

    // Redirect to Result Page
    window.location.href = 'result.html';
  },

  /**
   * Bind DOM buttons
   */
  bindControls() {
    document.getElementById('btnPrev')?.addEventListener('click', () => {
      this.previousQuestion();
    });

    document.getElementById('btnNext')?.addEventListener('click', () => {
      this.nextQuestion();
    });

    document.getElementById('btnClearChoice')?.addEventListener('click', () => {
      this.clearCurrentChoice();
    });

    document.getElementById('btnMarkReview')?.addEventListener('click', () => {
      this.toggleMarkForReview();
    });

    document.getElementById('btnSubmitTest')?.addEventListener('click', () => {
      this.promptSubmitConfirmation();
    });

    // Submit Modal buttons
    document.getElementById('btnConfirmSubmit')?.addEventListener('click', () => {
      document.getElementById('submitModal')?.classList.remove('active');
      this.calculateAndCompleteResult();
    });

    document.getElementById('btnCancelSubmit')?.addEventListener('click', () => {
      document.getElementById('submitModal')?.classList.remove('active');
    });

    // Keyboard shortcuts (ArrowLeft: Previous, ArrowRight: Next)
    window.addEventListener('keydown', (e) => {
      if (document.getElementById('submitModal')?.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') this.previousQuestion();
      if (e.key === 'ArrowRight') this.nextQuestion();
    });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
