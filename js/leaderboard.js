/**
 * QuizNest - Leaderboard Script
 * Renders ranked candidate attempts from localStorage, displays a visual podium
 * for the top 3 performers, provides difficulty filters, and highlights current user records.
 */

document.addEventListener('DOMContentLoaded', () => {
  LeaderboardEngine.init();
});

const LeaderboardEngine = {
  currentFilter: 'all',
  history: [],

  init() {
    this.history = Storage.getHistory();
    this.renderUserBadge();
    this.renderPodiumAndTable();
    this.bindFilters();
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

  bindFilters() {
    const filterButtons = document.querySelectorAll('[data-leaderboard-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-leaderboard-filter');
        this.renderPodiumAndTable();
      });
    });
  },

  getSortedFilteredList() {
    let list = [...this.history];

    if (this.currentFilter !== 'all') {
      list = list.filter(item => (item.difficulty || '').toLowerCase() === this.currentFilter.toLowerCase());
    }

    // Sort by Percentage descending, then by time taken ascending
    list.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return (a.timeTakenSeconds || 9999) - (b.timeTakenSeconds || 9999);
    });

    return list;
  },

  renderPodiumAndTable() {
    const list = this.getSortedFilteredList();
    const currentUsername = (Storage.getUsername() || '').toLowerCase();

    // 1. Render Podium (Top 3)
    const podiumEl = document.getElementById('leaderboardPodium');
    if (podiumEl) {
      if (list.length >= 3) {
        podiumEl.style.display = 'flex';
        const top1 = list[0];
        const top2 = list[1];
        const top3 = list[2];

        podiumEl.innerHTML = `
          <!-- Rank 2: Silver -->
          <div class="podium-slot rank-2">
            <div class="podium-avatar">🥈</div>
            <strong>${this.escapeHtml(top2.username)}</strong>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">${top2.percentage}%</span>
            <div class="podium-pillar">
              <span style="font-weight: 800; font-size: 1.2rem;">2nd</span>
            </div>
          </div>

          <!-- Rank 1: Gold -->
          <div class="podium-slot rank-1">
            <div class="podium-avatar">👑</div>
            <strong style="color: #fde68a;">${this.escapeHtml(top1.username)}</strong>
            <span style="font-size: 0.9rem; font-weight:700; color: #fde68a;">${top1.percentage}%</span>
            <div class="podium-pillar">
              <span style="font-weight: 800; font-size: 1.5rem; color: #f59e0b;">1st</span>
            </div>
          </div>

          <!-- Rank 3: Bronze -->
          <div class="podium-slot rank-3">
            <div class="podium-avatar">🥉</div>
            <strong>${this.escapeHtml(top3.username)}</strong>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">${top3.percentage}%</span>
            <div class="podium-pillar">
              <span style="font-weight: 800; font-size: 1.2rem;">3rd</span>
            </div>
          </div>
        `;
      } else {
        podiumEl.style.display = 'none';
      }
    }

    // 2. Render Table Rows
    const tableBody = document.getElementById('leaderboardTableBody');
    const emptyState = document.getElementById('leaderboardEmpty');

    if (!tableBody) return;

    if (list.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = list.map((item, index) => {
      const rank = index + 1;
      const isCurrentUser = (item.username || '').toLowerCase() === currentUsername;
      const diff = (item.difficulty || 'easy').toLowerCase();
      const badgeClass = `badge badge-${diff}`;

      let rankDisplay = `${rank}`;
      if (rank === 1) rankDisplay = '🥇 1';
      else if (rank === 2) rankDisplay = '🥈 2';
      else if (rank === 3) rankDisplay = '🥉 3';

      return `
        <tr style="${isCurrentUser ? 'background: rgba(99, 102, 241, 0.12); border-left: 4px solid var(--primary);' : ''}">
          <td><strong>${rankDisplay}</strong></td>
          <td>
            <strong>${this.escapeHtml(item.username)}</strong>
            ${isCurrentUser ? '<span class="badge" style="background: rgba(99, 102, 241, 0.3); color: var(--primary-light); margin-left:6px;">You</span>' : ''}
          </td>
          <td><span class="${badgeClass}">${diff.toUpperCase()}</span></td>
          <td><strong>${item.score} / ${item.totalQuestions}</strong></td>
          <td>
            <span style="font-weight: 800; color: ${item.percentage >= 80 ? 'var(--success)' : (item.percentage >= 50 ? 'var(--warning)' : 'var(--danger)')};">
              ${item.percentage}%
            </span>
          </td>
          <td>${item.timeTaken || '--:--'}</td>
          <td>${item.date || 'Recent'}</td>
        </tr>
      `;
    }).join('');
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
