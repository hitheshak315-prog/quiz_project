/**
 * QuizNest - Storage & Session Management
 * Handles localStorage persistence for user profiles, test sessions,
 * historical attempts, custom questions, and leaderboard scores.
 */

const STORAGE_KEYS = {
  USERNAME: 'quiznest_username',
  ACTIVE_TEST: 'quiznest_active_test',
  HISTORY: 'quiznest_history',
  LATEST_RESULT: 'quiznest_latest_result',
  CUSTOM_QUESTIONS: 'quiznest_custom_questions'
};

const Storage = {
  // ===============================
  // USERNAME MANAGEMENT
  // ===============================
  getUsername() {
    return localStorage.getItem(STORAGE_KEYS.USERNAME) || '';
  },

  setUsername(name) {
    if (name && name.trim()) {
      localStorage.setItem(STORAGE_KEYS.USERNAME, name.trim());
      return true;
    }
    return false;
  },

  hasUsername() {
    const name = this.getUsername();
    return name && name.trim().length > 0;
  },

  // ===============================
  // ACTIVE TEST SESSION MANAGEMENT
  // ===============================
  saveActiveTest(testState) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TEST, JSON.stringify(testState));
  },

  getActiveTest() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEST);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse active test from storage', e);
      return null;
    }
  },

  clearActiveTest() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEST);
  },

  // ===============================
  // LATEST COMPLETED RESULT
  // ===============================
  saveLatestResult(result) {
    localStorage.setItem(STORAGE_KEYS.LATEST_RESULT, JSON.stringify(result));
  },

  getLatestResult() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LATEST_RESULT);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load latest result', e);
      return null;
    }
  },

  // ===============================
  // TEST HISTORY MANAGEMENT
  // ===============================
  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) {
        // Seed initial benchmark mock data so dashboard & leaderboard look great on first launch
        const initialSeed = this.getSeedHistory();
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(initialSeed));
        return initialSeed;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading history', e);
      return [];
    }
  },

  saveAttempt(attempt) {
    const history = this.getHistory();
    // Prepend latest attempt to the beginning
    history.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  getAttemptById(id) {
    const history = this.getHistory();
    return history.find(item => item.id === id) || null;
  },

  // Seed data for initial demo
  getSeedHistory() {
    return [
      {
        id: 'seed_att_1',
        username: 'Ananya Sharma',
        category: 'web_development',
        categoryName: 'Web Development',
        difficulty: 'hard',
        score: 9,
        totalQuestions: 10,
        percentage: 90,
        correctCount: 9,
        incorrectCount: 1,
        unansweredCount: 0,
        timeTaken: '06:14',
        timeTakenSeconds: 374,
        date: '2026-09-25 15:42'
      },
      {
        id: 'seed_att_2',
        username: 'Aarav Patel',
        category: 'computer_science',
        categoryName: 'Computer Science',
        difficulty: 'medium',
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        correctCount: 8,
        incorrectCount: 2,
        unansweredCount: 0,
        timeTaken: '05:30',
        timeTakenSeconds: 330,
        date: '2026-09-26 11:15'
      },
      {
        id: 'seed_att_3',
        username: 'Priya Nair',
        category: 'general_tech',
        categoryName: 'General Tech Aptitude',
        difficulty: 'easy',
        score: 10,
        totalQuestions: 10,
        percentage: 100,
        correctCount: 10,
        incorrectCount: 0,
        unansweredCount: 0,
        timeTaken: '03:45',
        timeTakenSeconds: 225,
        date: '2026-09-26 18:20'
      }
    ];
  },

  // ===============================
  // CUSTOM USER QUESTIONS
  // ===============================
  getCustomQuestions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomQuestion(questionObj) {
    const list = this.getCustomQuestions();
    list.push(questionObj);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
  },

  deleteCustomQuestion(id) {
    let list = this.getCustomQuestions();
    list = list.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
  }
};
