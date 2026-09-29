/**
 * QuizNest - Custom Test Builder & Question Creator
 * Allows users to configure personalized mock test sessions and
 * author custom questions stored locally.
 */

document.addEventListener('DOMContentLoaded', () => {
  CustomTestEngine.init();
});

const CustomTestEngine = {
  init() {
    this.renderUserBadge();
    this.bindCustomTestForm();
    this.bindCustomQuestionForm();
    this.renderCustomQuestionsList();
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

  bindCustomTestForm() {
    const form = document.getElementById('customTestForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!Storage.hasUsername()) {
        const username = prompt('Please enter your name to take this custom test:');
        if (!username || !username.trim()) return;
        Storage.setUsername(username.trim());
      }

      const category = document.getElementById('customCategory').value;
      const difficulty = document.getElementById('customDifficulty').value;
      const totalQuestions = parseInt(document.getElementById('customCount').value, 10) || 10;
      const timeLimitMinutes = parseInt(document.getElementById('customTimer').value, 10) || 5;

      const testConfig = {
        difficulty: difficulty,
        category: category,
        totalQuestions: totalQuestions,
        timeLimitMinutes: timeLimitMinutes,
        timeRemainingSeconds: timeLimitMinutes * 60,
        startTime: Date.now()
      };

      Storage.saveActiveTest(testConfig);
      window.location.href = 'quiz.html';
    });
  },

  bindCustomQuestionForm() {
    const form = document.getElementById('addQuestionForm');
    const alertMsg = document.getElementById('customQuestionAlert');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const category = document.getElementById('newCategory').value;
      const difficulty = document.getElementById('newDifficulty').value;
      const questionText = document.getElementById('newQuestionText').value.trim();
      const optA = document.getElementById('newOptA').value.trim();
      const optB = document.getElementById('newOptB').value.trim();
      const optC = document.getElementById('newOptC').value.trim();
      const optD = document.getElementById('newOptD').value.trim();
      const correctChoice = document.getElementById('newCorrectChoice').value;
      const explanation = document.getElementById('newExplanation').value.trim();

      const options = [optA, optB, optC, optD];
      const correctIndex = parseInt(correctChoice, 10);
      const correctAnswer = options[correctIndex];

      const newQ = {
        id: `custom_${Date.now()}`,
        category: category,
        difficulty: difficulty,
        question: questionText,
        options: options,
        answer: correctAnswer,
        explanation: explanation || 'Created by custom question builder.'
      };

      Storage.saveCustomQuestion(newQ);

      if (alertMsg) {
        alertMsg.style.display = 'block';
        alertMsg.textContent = '✅ Question successfully added to the custom pool!';
        setTimeout(() => alertMsg.style.display = 'none', 3000);
      }

      form.reset();
      this.renderCustomQuestionsList();
    });
  },

  renderCustomQuestionsList() {
    const listEl = document.getElementById('customQuestionsList');
    if (!listEl) return;

    const list = Storage.getCustomQuestions();
    if (list.length === 0) {
      listEl.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          No custom questions added yet. Use the form above to add your own questions!
        </p>
      `;
      return;
    }

    listEl.innerHTML = list.map((q) => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <span class="badge badge-${q.difficulty}">${q.difficulty.toUpperCase()}</span>
          <strong style="margin-left: 8px;">${this.escapeHtml(q.question)}</strong>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
            Correct Answer: ${this.escapeHtml(q.answer)}
          </div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="CustomTestEngine.deleteQuestion('${q.id}')">Delete</button>
      </div>
    `).join('');
  },

  deleteQuestion(id) {
    if (confirm('Are you sure you want to remove this custom question?')) {
      Storage.deleteCustomQuestion(id);
      this.renderCustomQuestionsList();
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
