const MAX_NMT_SCORE = 200;
const MAX_POINTS = 45; 

export function calculateScore(results) {
  const total = results.length;
  const correct = results.filter(r => r.isCorrect).length;

  const nmtPoints = results.reduce((sum, r) => sum + r.score, 0);
  const percent = Math.round((nmtPoints / MAX_POINTS) * 100);
  const nmtScore = Math.round((nmtPoints / MAX_POINTS) * MAX_NMT_SCORE);

  return { correct, total, percent, nmtScore, nmtPoints, maxPoints: MAX_POINTS };
}