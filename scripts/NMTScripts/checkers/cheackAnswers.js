import { checkSingle } from "./checkSingle.js";
import { checkMatching } from "./checkMatching.js";

export function checkAnswers(test, userAnswers) {
  return test.map((question, index) => {
    const userAnswer = userAnswers[index];

    let score = 0;
    let maxScore = 1;

    switch (question.type) {
      case "single":
        score = checkSingle(question, userAnswer) ? 1 : 0;
        maxScore = 1;
        break;
      case "matching":
        score = checkMatching(question, userAnswer);
        maxScore = 4;
        break;
      default:
        score = 0;
        maxScore = 1;
    }

    return {
      questionIndex: index,
      isCorrect: score === maxScore,
      score,
      maxScore,
      userAnswer,
      correctAnswer: question.correct ?? question.correctPairs,
    };
  });
}