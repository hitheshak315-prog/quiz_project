/**
 * QuizNest - Dashboard Page Script
 * Calculates aggregate performance statistics from localStorage history,
 * renders interactive metric cards, difficulty/category breakdowns,
 * recent attempts table, and clear history functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
  DashboardEngine.init();
});

const DashboardEngine = {
  history: [],

  init() {
    this.history = Storage.getHistory();
    this.renderUserBadge();
    this.calculateAndRenderMetrics();
    this.renderAttemptsTable();
    this.bindEvents();
  },

  renderUserBadge() {
    const user = Storage.getUsername();
    const welcomeEl = document.getElementById('dashWelcome');
    const badgeEl = document.getElementById('navUserBadge');

    if (welcomeEl) {
      welcomeEl.textContent = user 
        ? `Welcome to your learning analytics, ${user}!` 
        : 'Welcome to your learning analytics!';
    }

    if (badgeEl && user) {
      badgeEl.innerHTML = `
        <span class="user-avatar">${user.charAt(0).toUpperCase()}</span>
        <span>${this.escapeHtml(user)}</span>
      `;
    }
  },

  calculateAndRenderMetrics() {
    const count = this.history.length;
    let totalScore = 0;
    let bestScore = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;

    this.history.forEach(item => {
      const pct = item.percentage || 0;
      totalScore += pct;
      if (pct > bestScore) bestScore = pct;
      totalCorrect += (item.correctCount || item.score || 0);
      totalQuestions += (item.totalQuestions || 10);
    });

    const avgScore = count > 0 ? Math.round(totalScore / count) : 0;
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Render Metric Cards
    document.getElementById('dashTestsTaken').textContent = count;
    document.getElementById('dashAvgScore').textContent = `${avgScore}%`;
    document.getElementById('dashBestScore').textContent = `${bestScore}%`;
    document.getElementById('dashTotalCorrect').textContent = totalCorrect;
    document.getElementById('dashTotalAttempted').textContent = totalQuestions;
    document.getElementById('dashAccuracy').textContent = `${accuracy}%`;
  },

  renderAttemptsTable() {
    const tableBody = document.getElementById('dashAttemptsTableBody');
    const emptyState = document.getElementById('dashEmptyState');
    if (!tableBody) return;

    if (this.history.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = this.history.map((item, idx) => {
      const diff = (item.difficulty || 'easy').toLowerCase();
      const badgeClass = `badge badge-${diff}`;

      return `
        <tr>
          <td>
            <strong>${this.escapeHtml(item.categoryName || 'Mock Test')}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${item.id}</div>
          </td>
          <td><span class="${badgeClass}">${diff.toUpperCase()}</span></td>
          <td><strong>${item.score} / ${item.totalQuestions}</strong></td>
          <td>
            <span style="font-weight: 700; color: ${item.percentage >= 80 ? 'var(--success)' : (item.percentage >= 50 ? 'var(--warning)' : 'var(--danger)')};">
              ${item.percentage}%
            </span>
          </td>
          <td>${item.timeTaken || '--:--'}</td>
          <td>${item.date || 'Recent'}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="DashboardEngine.viewAttempt('${item.id}')">
              Review
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  viewAttempt(attemptId) {
    const attempt = Storage.getAttemptById(attemptId);
    if (attempt) {
      Storage.saveLatestResult(attempt);
      window.location.href = 'review.html';
    }
  },

  bindEvents() {
    // Clear History Button
    const btnClear = document.getElementById('btnClearHistory');
    const clearModal = document.getElementById('clearHistoryModal');
    const btnConfirmClear = document.getElementById('btnConfirmClear');
    const btnCancelClear = document.getElementById('btnCancelClear');

    btnClear?.addEventListener('click', () => {
      clearModal?.classList.add('active');
    });

    btnConfirmClear?.addEventListener('click', () => {
      Storage.clearHistory();
      clearModal?.classList.remove('active');
      this.history = [];
      this.calculateAndRenderMetrics();
      this.renderAttemptsTable();
    });

    btnCancelClear?.addEventListener('click', () => {
      clearModal?.classList.remove('active');
    });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
