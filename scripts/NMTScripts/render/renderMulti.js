export function renderMulti(question, container, onAnswer, savedAnswer) {
  container.innerHTML = "";

  // ── ТЕКСТ з фігурами ──
  if (question.passages && question.passages.length > 0) {
    const passagesBox = document.createElement("div");
    passagesBox.className = "passages-box";

    question.passages.forEach(({ fig, text }) => {
      const row = document.createElement("div");
      row.className = "passage-row";

      const figEl = document.createElement("div");
      figEl.className = "passage-num";
      figEl.innerHTML = fig; // SVG — innerHTML

      const textEl = document.createElement("p");
      textEl.className = "passage-text";
      textEl.innerHTML = text; // innerHTML бо може бути <b>

      row.appendChild(figEl);
      row.appendChild(textEl);
      passagesBox.appendChild(row);
    });

    container.appendChild(passagesBox);
  }

  // ── ПИТАННЯ ──
  const questionEl = document.createElement("p");
  questionEl.className = "question-task";
  questionEl.textContent = question.question;
  container.appendChild(questionEl);

  // ── ВАРІАНТИ ВІДПОВІДЕЙ ──
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "options-container";

  const isSvg = question.answerType === "svg";

  question.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = `answer-btn${isSvg ? " answer-btn--svg" : ""}`;
    btn.dataset.index = index;

    if (isSvg) {
      btn.innerHTML = answer;
    } else {
      btn.textContent = answer;
    }

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