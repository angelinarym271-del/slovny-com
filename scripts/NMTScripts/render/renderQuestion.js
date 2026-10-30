import { renderSingleChoice } from "./renderSingleChoice.js";
import { renderMatching } from "./renderMatching.js";
import { renderMulti } from "./renderMulti.js";

export function renderQuestion(question, container, onAnswer, savedAnswer) {
  container.innerHTML = "";

  switch (question.type) {
    case "single":
      renderSingleChoice(question, container, onAnswer, savedAnswer);
      break;

    case "matching":
      renderMatching(question, container, onAnswer, savedAnswer);
      break;

    case "multi":
      renderMulti(question, container, onAnswer, savedAnswer);
      break;

    default:
      container.innerHTML = `<p>Невідомий тип питання: ${question.type}</p>`;
  }
}