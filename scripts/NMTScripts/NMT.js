import { generateTest } from "./generators/generateTest.js";
import { renderQuestion } from "./render/renderQuestion.js";
import { checkAnswers } from "./checkers/cheackAnswers.js";
import { calculateScore } from "./checkers/calculateScore.js";

const startBtn = document.getElementById("startNMTTest");
const testArea = document.getElementById("testArea");
const resultArea = document.getElementById("resultArea");
const questionBody = document.getElementById("questionBody");
const questionCounter = document.getElementById("questionCounter");
const timerElement = document.getElementById("timer");
const nextBtn = document.getElementById("nextQuestionBtn");
const prevBtn = document.getElementById("prevQuestionBtn");
const finishBtn = document.getElementById("finishTestBtn");

let test = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = 60*60;
let timerInterval = null;



function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}



function renderCurrentQuestion() {
  const current = test[currentQuestionIndex];

  questionCounter.textContent = `Завдання ${currentQuestionIndex + 1} з ${test.length}`;

  renderQuestion(
    current,
    questionBody,
    (answer) => {
      userAnswers[currentQuestionIndex] = answer;
    },
    userAnswers[currentQuestionIndex]
  );

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === test.length - 1;
}



function startTest() {
  startBtn.style.display = "none";
  resultArea.style.display = "none";
  testArea.style.display = "block";

  test = generateTest();
  currentQuestionIndex = 0;
  userAnswers = new Array(test.length).fill(null);
  timeLeft = 60 * 60;

  startTimer();
  renderCurrentQuestion();
}



function nextQuestion() {
  if (currentQuestionIndex < test.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  }
}



function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}


function finishTest() {
  clearInterval(timerInterval);
  timerInterval = null;

  testArea.style.display = "none";
  resultArea.style.display = "flex";

  const results = checkAnswers(test, userAnswers);
  const { correct, total, percent, nmtScore, nmtPoints, maxPoints } = calculateScore(results);

  resultArea.innerHTML = `
    <div class="result-box">
      <h2>Тест завершено</h2>

      <div class="result-main">
        <span class="result-fraction">${correct}/${total}</span>
        <span class="result-percent">${percent}%</span>
      </div>

      <div class="result-details">
        <div class="result-item">
          <span class="result-label">Бал НМТ</span>
          <span class="result-value">${nmtScore} / 200</span>
        </div>
        <div class="result-item">
          <span class="result-label">Балів набрано</span>
          <span class="result-value">${nmtPoints} / ${maxPoints}</span>
        </div>
      </div>

      <button id="retryBtn" class="retry-btn">Спробувати ще раз</button>
    </div>
  `;

  document.getElementById("retryBtn").addEventListener("click", () => {
    resultArea.style.display = "none";
    resultArea.innerHTML = "";
    startTest(); // одразу запускаємо новий тест без проміжного екрану
  });
}



startBtn.addEventListener("click", startTest);
nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);
finishBtn.addEventListener("click", finishTest);