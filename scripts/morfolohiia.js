import { morphology } from './NMTScripts/data/questions/morphology.js';


window.startMorphologyTest = startMorphologyTest;
window.nextMorphologyTask = nextMorphologyTask;
window.checkMatching = checkMatching;

// Кількість завдань кожного типу в одному тесті
const SINGLE_COUNT = 4;
const MATCHING_COUNT = 1;

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

function startMorphologyTest() {
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("testArea").style.display = "flex";

  const singles = shuffle(morphology.filter(t => t.type !== "matching"))
    .slice(0, SINGLE_COUNT);
  const matchings = shuffle(morphology.filter(t => t.type === "matching"))
    .slice(0, MATCHING_COUNT);

  // перемішуємо, щоб завдання на співвіднесення потрапляло в різні місця тесту
  testTasks = shuffle([...singles, ...matchings]);
  totalQuestions = testTasks.length;

  currentIndex = 0;
  correct = 0;
  wrong = 0;
  results = [];

  showTask();
}

function showTask() {
  const taskObj = testTasks[currentIndex];

  const answersBox = document.getElementById("answers");
  const matchingBox = document.getElementById("matching");
  const checkBtn = document.getElementById("checkBtn");
  const questionEl = document.getElementById("question");

  document.getElementById("nextBtn").style.display = "none";
  checkBtn.style.display = "none";
  answered = false;

  document.getElementById("counter").textContent =
    `Завдання ${currentIndex + 1} з ${totalQuestions}`;

  // task, question і відповіді містять HTML, тому innerHTML
  document.getElementById("task").innerHTML = taskObj.task;

  questionEl.innerHTML = taskObj.question || "";
  questionEl.style.display = taskObj.question ? "block" : "none";

  answersBox.innerHTML = "";
  matchingBox.innerHTML = "";

  if (taskObj.type === "matching") {
    answersBox.style.display = "none";
    matchingBox.style.display = "";
    showMatching(taskObj);
  } else {
    matchingBox.style.display = "none";
    answersBox.style.display = "";
    showSingle(taskObj);
  }
}

/* ───────── ТИП "single" ───────── */

function showSingle(taskObj) {
  const answersBox = document.getElementById("answers");

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

/* ───────── ТИП "matching" (таблиця) ───────── */

const LETTERS = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж"];
let matchSelections = [];   // matchSelections[рядок] = індекс вибраного стовпця

function showMatching(taskObj) {
  const matchingBox = document.getElementById("matching");
  const checkBtn = document.getElementById("checkBtn");

  matchSelections = taskObj.left.map(() => null);

  // ліві та праві списки
  const leftItems = taskObj.left
    .map((text, i) => `
      <div class="match-item">
        <span class="match-num">${i + 1}</span>
        <span class="match-text">${text}</span>
      </div>`)
    .join("");

  const rightItems = taskObj.right
    .map((text, j) => `
      <div class="match-item">
        <span class="match-num">${LETTERS[j]}</span>
        <span class="match-text">${text}</span>
      </div>`)
    .join("");

  // таблиця: рядки — номери, стовпці — букви
  const head = taskObj.right
    .map((_, j) => `<th>${LETTERS[j]}</th>`)
    .join("");

  const body = taskObj.left
    .map((_, i) => {
      const cells = taskObj.right
        .map((__, j) => `
          <td>
            <button type="button" class="match-cell"
                    data-row="${i}" data-col="${j}"
                    aria-label="Пункт ${i + 1}, варіант ${LETTERS[j]}"></button>
          </td>`)
        .join("");
      return `<tr><th>${i + 1}</th>${cells}</tr>`;
    })
    .join("");

  matchingBox.innerHTML = `
    <div class="match-lists">
      <div class="match-list">${leftItems}</div>
      <div class="match-list">${rightItems}</div>
    </div>
    <table class="match-table">
      <thead><tr><th></th>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;

  // кількість стовпців потрібна CSS, щоб клітинки були квадратними
  matchingBox.querySelector(".match-table")
    .style.setProperty("--cols", taskObj.right.length);

  matchingBox.querySelectorAll(".match-cell").forEach(cell => {
    cell.onclick = () => selectCell(Number(cell.dataset.row), Number(cell.dataset.col));
  });

  checkBtn.disabled = true;
  checkBtn.style.display = "block";
}

// в одному рядку можна вибрати лише одну клітинку
function selectCell(row, col) {
  if (answered) return;

  const cells = document.querySelectorAll(`.match-cell[data-row="${row}"]`);
  cells.forEach(c => c.classList.remove("selected"));

  // повторний клік по вибраній клітинці знімає вибір
  if (matchSelections[row] === col) {
    matchSelections[row] = null;
  } else {
    matchSelections[row] = col;
    cells[col].classList.add("selected");
  }

  document.getElementById("checkBtn").disabled =
    matchSelections.some(v => v === null);
}

function checkMatching() {
  if (answered) return;

  const taskObj = testTasks[currentIndex];
  if (taskObj.type !== "matching") return;

  // не перевіряємо, поки не заповнено всі рядки
  if (matchSelections.some(v => v === null)) return;

  answered = true;
  let allCorrect = true;

  taskObj.left.forEach((_, i) => {
    const rowCells = document.querySelectorAll(`.match-cell[data-row="${i}"]`);
    const chosen = matchSelections[i];
    const rightIndex = taskObj.correctPairs[i];

    if (chosen === rightIndex) {
      rowCells[chosen].classList.add("correct");
    } else {
      allCorrect = false;
      rowCells[chosen].classList.add("wrong");
      rowCells[rightIndex].classList.add("hint");   // правильна клітинка
    }
  });

  document.querySelector(".match-table").classList.add("disabled");

  // завдання зараховується, лише якщо правильні всі пари
  if (allCorrect) {
    correct++;
  } else {
    wrong++;
    results.push(taskObj);
  }

  document.getElementById("checkBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "block";
}

/* ───────── ПЕРЕХІД І ПІДСУМОК ───────── */

function nextMorphologyTask() {
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

  resultArea.innerHTML = `
    <h2>Результат</h2>
    <p>Правильних: ${correct}</p>
    <p>Неправильних: ${wrong}</p>
    <button id="restartBtn">Пройти ще раз</button>
  `;

  document.getElementById("restartBtn").onclick = restartTest;
}

function restartTest() {
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("startBtn").style.display = "block";
}