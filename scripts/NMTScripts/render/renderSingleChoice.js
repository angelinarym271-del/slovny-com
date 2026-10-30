import normalizeQuestion from "../utils/normalizeQuestion.js";

export function renderSingleChoice(question, container, onAnswer, savedAnswer) {
  const q = normalizeQuestion(question);

  container.innerHTML = "";

  const task = document.createElement("h2");
  task.className = "question-task";
  task.innerHTML = q.task;
  container.appendChild(task);

  if (q.question && q.question !== q.task) {
    const questionText = document.createElement("p");
    questionText.className = "question-text";
    questionText.innerHTML = q.question;
    container.appendChild(questionText);
  }

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "options-container";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerHTML = option;
    btn.dataset.index = index;

    // відновлюємо вибір якщо є збережена відповідь
    if (savedAnswer === index) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      optionsContainer
        .querySelectorAll(".answer-btn")
        .forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswer(index);
    });

    optionsContainer.appendChild(btn);
  });

  container.appendChild(optionsContainer);
}