import { phonetics } from './NMTScripts/data/questions/phonetics.js';

window.startPhoneticsTest = startPhoneticsTest;
window.nextPhoneticsTask = nextPhoneticsTask;

const MAX_QUESTIONS = 10;

let testTasks = [];
let totalQuestions = 0;
let results = [];       // завдання, у яких була помилка
let currentIndex = 0;
let correct = 0;
let wrong = 0;
let answered = false;

// Перемішування за алгоритмом Фішера-Єйтса
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startPhoneticsTest() {
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("testArea").style.display = "flex";

  testTasks = shuffle(phonetics).slice(0, MAX_QUESTIONS);
  totalQuestions = testTasks.length;

  currentIndex = 0;
  correct = 0;
  wrong = 0;
  results = [];

  showTask();
}

function showTask() {
  document.getElementById("nextBtn").style.display = "none";
  answered = false;

  const taskObj = testTasks[currentIndex];
  const answersBox = document.getElementById("answers");
  const questionEl = document.getElementById("question");

  document.getElementById("counter").textContent =
    `Завдання ${currentIndex + 1} з ${totalQuestions}`;

  // task і answers містять HTML (<strong>, <u>, <em>), тому innerHTML
  document.getElementById("task").innerHTML = taskObj.task;

  questionEl.innerHTML = taskObj.question || "";
  questionEl.style.display = taskObj.question ? "block" : "none";

  answersBox.innerHTML = "";

  taskObj.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.classList.add("answer");
    btn.onclick = () => checkAnswer(index);
    answersBox.appendChild(btn);
  });
}

function checkAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const taskObj = testTasks[currentIndex];
  const buttons = document.querySelectorAll("#answers .answer");

  // correct може бути числом або масивом (на майбутнє)
  const correctIndexes = Array.isArray(taskObj.correct)
    ? taskObj.correct
    : [taskObj.correct];

  if (correctIndexes.includes(selectedIndex)) {
    correct++;
    buttons[selectedIndex].classList.add("correct");
  } else {
    wrong++;
    buttons[selectedIndex].classList.add("wrong");
    correctIndexes.forEach(i => buttons[i].classList.add("correct"));
    results.push(taskObj);
  }

  // блокуємо повторні кліки
  buttons.forEach(btn => btn.classList.add("disabled"));

  document.getElementById("nextBtn").style.display = "block";
}

function nextPhoneticsTask() {
  if (!answered) return;

  currentIndex++;

  if (currentIndex < totalQuestions) {
    showTask();
  } else {
    finishTest();
  }
}

function finishTest() {
  document.getElementById("testArea").style.display = "none";

  const resultArea = document.getElementById("resultArea");
  resultArea.style.display = "flex";

  let html = `
    <h2>Результат</h2>
    <p>Правильних: ${correct}</p>
    <p>Неправильних: ${wrong}</p>
  `;

  // Список помилок із правильними відповідями (тимчасово вимкнено)
  /*
  if (results.length > 0) {
    html += `<h3>Помилки у завданнях:</h3><ul class="mistakes">`;

    results.forEach(item => {
      const correctIndexes = Array.isArray(item.correct)
        ? item.correct
        : [item.correct];

      const correctText = correctIndexes
        .map(i => item.answers[i])
        .join("<br>");

      html += `
        <li>
          <div class="mistake-task">${item.task}</div>
          <div class="mistake-answer">${correctText}</div>
        </li>
      `;
    });

    html += `</ul>`;
  }
  */

  html += `<button id="restartBtn">Пройти ще раз</button>`;

  resultArea.innerHTML = html;
  document.getElementById("restartBtn").onclick = restartTest;
}

function restartTest() {
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("startBtn").style.display = "block";
}