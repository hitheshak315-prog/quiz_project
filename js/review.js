/**
 * QuizNest - Review Answers Page Script
 * Enables detailed review of all questions with clear visual distinctions
 * between user selections and correct answers, accompanied by explanations.
 */

document.addEventListener('DOMContentLoaded', () => {
  ReviewEngine.init();
});

const ReviewEngine = {
  result: null,
  currentFilter: 'all',

  init() {
    this.result = Storage.getLatestResult();
    if (!this.result || !this.result.reviewDetails) {
      window.location.href = 'index.html';
      return;
    }

    this.renderHeaderSummary();
    this.renderFilterButtons();
    this.renderQuestions();
  },

  renderHeaderSummary() {
    const titleEl = document.getElementById('reviewTestTitle');
    const scoreEl = document.getElementById('reviewScoreSummary');

    if (titleEl) {
      titleEl.textContent = `${this.result.categoryName || 'Mock Test'} (${(this.result.difficulty || 'Easy').toUpperCase()})`;
    }

    if (scoreEl) {
      scoreEl.textContent = `Score: ${this.result.score}/${this.result.totalQuestions} (${this.result.percentage}%)`;
    }
  },

  renderFilterButtons() {
    const filterContainer = document.getElementById('reviewFilters');
    if (!filterContainer) return;

    const total = this.result.reviewDetails.length;
    const incorrectCount = this.result.incorrectCount + this.result.unansweredCount;
    const correctCount = this.result.correctCount;
    const markedCount = this.result.reviewDetails.filter(q => q.isMarked).length;

    filterContainer.innerHTML = `
      <button class="filter-btn active" data-filter="all">All (${total})</button>
      <button class="filter-btn" data-filter="incorrect">Mistakes & Skipped (${incorrectCount})</button>
      <button class="filter-btn" data-filter="correct">Correct (${correctCount})</button>
      <button class="filter-btn" data-filter="marked">Marked for Review (${markedCount})</button>
    `;

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderQuestions();
      });
    });
  },

  renderQuestions() {
    const listContainer = document.getElementById('reviewQuestionsList');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    const filtered = this.result.reviewDetails.filter(item => {
      if (this.currentFilter === 'all') return true;
      if (this.currentFilter === 'incorrect') return !item.isCorrect;
      if (this.currentFilter === 'correct') return item.isCorrect;
      if (this.currentFilter === 'marked') return item.isMarked;
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🎉</div>
          <h3>No questions match this filter!</h3>
          <p>Great job! You have no questions in this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement('div');
      
      let statusClass = 'is-skipped';
      let statusBadge = '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--warning);">⚪ Skipped</span>';

      if (item.isAnswered) {
        if (item.isCorrect) {
          statusClass = 'is-correct';
          statusBadge = '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: var(--success);">✅ Correct</span>';
        } else {
          statusClass = 'is-incorrect';
          statusBadge = '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: var(--danger);">❌ Incorrect</span>';
        }
      }

      const markedBadge = item.isMarked 
        ? '<span class="badge badge-review" style="margin-left: 8px;">⭐ Was Marked</span>' 
        : '';

      card.className = `review-item-card ${statusClass}`;

      // Build options HTML
      const optionsHtml = item.options.map(opt => {
        const isUserChoice = item.userAnswer === opt;
        const isCorrectChoice = item.correctAnswer.trim() === opt.trim();

        let optClass = '';
        let optIcon = '';

        if (isCorrectChoice) {
          optClass = 'opt-correct';
          optIcon = '<span>✅ (Correct Answer)</span>';
        } else if (isUserChoice && !item.isCorrect) {
          optClass = 'opt-user-wrong';
          optIcon = '<span>❌ (Your Choice)</span>';
        }

        return `
          <div class="review-opt ${optClass}">
            <span>${this.escapeHtml(opt)}</span>
            ${optIcon}
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="review-item-header">
          <div>
            <strong>Question ${item.questionNumber}</strong>
            ${markedBadge}
          </div>
          <div>${statusBadge}</div>
        </div>

        <div class="review-question-text">${this.escapeHtml(item.question)}</div>

        <div class="review-options-list">
          ${optionsHtml}
        </div>

        <div class="explanation-card">
          <strong>💡 Explanation:</strong>
          ${this.escapeHtml(item.explanation || 'No detailed explanation provided.')}
        </div>
      `;

      listContainer.appendChild(card);
    });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
