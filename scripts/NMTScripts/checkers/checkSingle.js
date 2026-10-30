
export function checkSingle(question, userAnswer) {
  if (userAnswer === null || userAnswer === undefined) return false;
  return userAnswer === question.correct;
}