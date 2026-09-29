/**
 * QuizNest - Result Page Script
 * Reads latest test result, calculates dynamic feedback, renders trophy for top performers,
 * and handles retake / review / navigation actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initResultPage();
});

function initResultPage() {
  const result = Storage.getLatestResult();
  if (!result) {
    window.location.href = 'index.html';
    return;
  }

  const username = result.username || Storage.getUsername() || 'Candidate';
  const percentage = result.percentage || 0;
  const score = result.score || 0;
  const total = result.totalQuestions || 10;
  const difficulty = (result.difficulty || 'Easy').toUpperCase();

  // Elements
  const headerGreeting = document.getElementById('resultGreeting');
  const userCongrats = document.getElementById('resultUserCongrats');
  const scoreBig = document.getElementById('scoreBig');
  const scoreTotal = document.getElementById('scoreTotal');
  const percentageEl = document.getElementById('percentageBadge');
  const trophyBanner = document.getElementById('trophyBanner');
  const trophyUser = document.getElementById('trophyUsername');
  const perfTitle = document.getElementById('perfTitle');
  const perfDesc = document.getElementById('perfDesc');

  // Breakdown values
  const statCorrect = document.getElementById('resCorrect');
  const statIncorrect = document.getElementById('resIncorrect');
  const statUnanswered = document.getElementById('resUnanswered');
  const statTotal = document.getElementById('resTotal');
  const statDifficulty = document.getElementById('resDifficulty');
  const statTime = document.getElementById('resTimeTaken');

  // Populate basic text
  if (userCongrats) userCongrats.textContent = `Congratulations, ${username}!`;
  if (scoreBig) scoreBig.textContent = score;
  if (scoreTotal) scoreTotal.textContent = `/ ${total}`;
  if (percentageEl) percentageEl.textContent = `${percentage}%`;

  if (statCorrect) statCorrect.textContent = result.correctCount;
  if (statIncorrect) statIncorrect.textContent = result.incorrectCount;
  if (statUnanswered) statUnanswered.textContent = result.unansweredCount;
  if (statTotal) statTotal.textContent = total;
  if (statDifficulty) statDifficulty.textContent = difficulty;
  if (statTime) statTime.textContent = result.timeTaken || '00:00';

  // Dynamic feedback and Winner section based on score
  if (percentage >= 80) {
    // High Score / Top Performer
    if (perfTitle) perfTitle.textContent = `Outstanding Performance! 🎉`;
    if (perfDesc) perfDesc.textContent = `Congratulations, ${username}! Excellent performance. You demonstrated mastery of this test! Keep it up!`;
    
    // Show Top Performer Trophy
    if (trophyBanner) {
      trophyBanner.style.display = 'flex';
      if (trophyUser) trophyUser.textContent = `Congratulations, ${username}! You are one of the top performers!`;
    }
  } else if (percentage >= 50) {
    // Average Score
    if (perfTitle) perfTitle.textContent = `Good Job! 👍`;
    if (perfDesc) perfDesc.textContent = `Good job, ${username}! You did well. Keep practicing and review your missed questions to improve even further.`;
    if (trophyBanner) trophyBanner.style.display = 'none';
  } else {
    // Low Score
    if (perfTitle) perfTitle.textContent = `Nice Attempt! 💡`;
    if (perfDesc) perfDesc.textContent = `Nice attempt, ${username}! Every test is a learning experience. Review the answer explanations and retake the test to master these concepts.`;
    if (trophyBanner) trophyBanner.style.display = 'none';
  }

  // Button Listeners
  document.getElementById('btnReviewAnswers')?.addEventListener('click', () => {
    window.location.href = 'review.html';
  });

  document.getElementById('btnRetakeTest')?.addEventListener('click', () => {
    retakeTest(result);
  });

  document.getElementById('btnTryAnotherTest')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  document.getElementById('btnGoDashboard')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  document.getElementById('btnGoLeaderboard')?.addEventListener('click', () => {
    window.location.href = 'leaderboard.html';
  });
}

/**
 * Retakes the test with new randomizations
 */
function retakeTest(previousResult) {
  const difficulty = previousResult.difficulty || 'easy';
  const category = previousResult.category || 'all';

  let timeLimitMinutes = 5;
  if (difficulty === 'medium') timeLimitMinutes = 7;
  if (difficulty === 'hard') timeLimitMinutes = 10;

  const newTestConfig = {
    difficulty: difficulty,
    category: category,
    totalQuestions: previousResult.totalQuestions || 10,
    timeLimitMinutes: timeLimitMinutes,
    timeRemainingSeconds: timeLimitMinutes * 60,
    startTime: Date.now()
  };

  Storage.saveActiveTest(newTestConfig);
  window.location.href = 'quiz.html';
}
