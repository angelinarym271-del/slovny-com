export function checkMatching(question, userAnswer) {
  if (!userAnswer || typeof userAnswer !== "object") return 0;

  const correct = question.correctPairs;
  let score = 0;

  for (const key in correct) {
    if (userAnswer[Number(key)] === correct[key]) {
      score++;
    }
  }

  return score; // число від 0 до 4
}