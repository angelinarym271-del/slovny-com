import { complexSentences } from './NMTScripts/data/questions/complex_sentence.js';
import { sentenceParts } from './NMTScripts/data/questions/syntax.js';

window.startSyntaxTest = startSyntaxTest;
window.nextSyntaxTask = nextSyntaxTask;
window.checkMatching = checkMatching;

// Склад одного тесту
const SINGLE_COUNT = 3;             // прості завдання (з sentenceParts)
const MATCHING_FROM_COMPLEX = 1;    // співвіднесення з complexSentences
const MATCHING_FROM_PARTS = 1;      // співвіднесення з sentenceParts

let testTasks = [];
let totalQuestions = 0;
let taskScores = [];    // підсумок кожного завдання: { type, earned, max }
let currentIndex = 0;
let answered = false;

/* ───────── БАЛИ ─────────
   Просте завдання: 1 бал за правильну відповідь.
   Відповідність: 1 бал за кожну правильну пару (часткова відповідь теж рахується).
   Щоб змінити шкалу, достатньо поправити цю функцію. */
function pointsForMatching(correctPairs, totalPairs) {
  return correctPairs;
}

// Перемішування за алгоритмом Фішера-Єйтса
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startSyntaxTest() {
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("testArea").style.display = "flex";

  const singles = shuffle(sentenceParts.filter(t => t.type !== "matching"))
    .slice(0, SINGLE_COUNT);

  const matchingComplex = shuffle(complexSentences.filter(t => t.type === "matching"))
    .slice(0, MATCHING_FROM_COMPLEX);

  const matchingParts = shuffle(sentenceParts.filter(t => t.type === "matching"))
    .slice(0, MATCHING_FROM_PARTS);

  // порядок фіксований: спочатку прості завдання, потім відповідність із sentenceParts,
  // останнім — відповідність із complexSentences
  testTasks = [...singles, ...matchingParts, ...matchingComplex];
  totalQuestions = testTasks.length;

  currentIndex = 0;
  taskScores = [];

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

  const isCorrect = correctIndexes.includes(selectedIndex);

  if (isCorrect) {
    buttons[selectedIndex].classList.add("correct");
  } else {
    buttons[selectedIndex].classList.add("wrong");
    correctIndexes.forEach(i => buttons[i].classList.add("correct"));
  }

  taskScores.push({ type: "single", earned: isCorrect ? 1 : 0, max: 1 });

  // блокуємо повторні кліки
  buttons.forEach(btn => btn.classList.add("disabled"));

  document.getElementById("nextBtn").style.display = "block";
}

/* ───────── ТИП "matching" (таблиця) ───────── */

const LETTERS = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж"];
let matchSelections = [];   // matchSelections[рядок] = індекс вибраного стовпця

// довжина тексту без HTML-тегів (для підбору ширини колонок)
function plainLength(html) {
  return html.replace(/<[^>]*>/g, "").trim().length;
}

function averageLength(items) {
  if (!items.length) return 1;
  return items.reduce((sum, t) => sum + plainLength(t), 0) / items.length;
}

function showMatching(taskObj) {
  const matchingBox = document.getElementById("matching");
  const checkBtn = document.getElementById("checkBtn");

  // У завданнях «проста — складна» поля називаються simple / complex,
  // в інших — left / right. Зводимо до єдиного вигляду.
  const left = taskObj.left || taskObj.simple;
  const right = taskObj.right || taskObj.complex;

  matchSelections = left.map(() => null);

  // Вихідний текст (вірш) над списками, якщо він є в завданні
  const sourceText = taskObj.text
    ? `<div class="match-source">${taskObj.text.trim()}</div>`
    : "";

  // ширина колонок залежить від того, у якій колонці тексту більше
  const ratio = Math.min(1.8, Math.max(0.6, averageLength(left) / averageLength(right)));

  const leftItems = left
    .map((text, i) => `
      <div class="match-item">
        <span class="match-num">${i + 1}</span>
        <span class="match-text">${text}</span>
      </div>`)
    .join("");

  const rightItems = right
    .map((text, j) => `
      <div class="match-item">
        <span class="match-num">${LETTERS[j]}</span>
        <span class="match-text">${text}</span>
      </div>`)
    .join("");

  // таблиця: рядки — номери, стовпці — букви
  const head = right
    .map((_, j) => `<th>${LETTERS[j]}</th>`)
    .join("");

  const body = left
    .map((_, i) => {
      const cells = right
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
    ${sourceText}
    <div class="match-lists" style="--lw: ${ratio.toFixed(2)}">
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
    .style.setProperty("--cols", right.length);

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
  let correctPairs = 0;

  matchSelections.forEach((chosen, i) => {
    const rowCells = document.querySelectorAll(`.match-cell[data-row="${i}"]`);
    const rightIndex = taskObj.correctPairs[i];

    if (chosen === rightIndex) {
      correctPairs++;
      rowCells[chosen].classList.add("correct");
    } else {
      rowCells[chosen].classList.add("wrong");
      rowCells[rightIndex].classList.add("hint");   // правильна клітинка
    }
  });

  document.querySelector(".match-table").classList.add("disabled");

  const totalPairs = matchSelections.length;
  const earned = pointsForMatching(correctPairs, totalPairs);
  taskScores.push({ type: "matching", earned, max: totalPairs });

  // підсумок по завданню під таблицею
  const status = correctPairs === totalPairs ? "full"
               : correctPairs === 0 ? "zero"
               : "partial";

  const scoreEl = document.createElement("div");
  scoreEl.classList.add("match-score", status);
  scoreEl.textContent = `Правильних пар: ${correctPairs} з ${totalPairs}`;
  document.getElementById("matching").appendChild(scoreEl);

  document.getElementById("checkBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "block";
}

/* ───────── ПЕРЕХІД І ПІДСУМОК ───────── */

function nextSyntaxTask() {
  if (!answered) return;

  currentIndex++;

  if (currentIndex < totalQuestions) {
    showTask();
  } else {
    finishTest();
  }
}

const TYPE_LABELS = {
  single: "Вибір відповіді",
  matching: "Відповідність"
};

function finishTest() {
  document.getElementById("testArea").style.display = "none";

  const resultArea = document.getElementById("resultArea");
  resultArea.style.display = "flex";

  const earned = taskScores.reduce((sum, t) => sum + t.earned, 0);
  const max = taskScores.reduce((sum, t) => sum + t.max, 0);
  const percent = max ? Math.round((earned / max) * 100) : 0;

  const rows = taskScores
    .map((t, i) => {
      const status = t.earned === t.max ? "full"
                   : t.earned === 0 ? "zero"
                   : "partial";
      return `
        <li class="score-row ${status}">
          <span class="score-name">Завдання ${i + 1}</span>
          <span class="score-type">${TYPE_LABELS[t.type]}</span>
          <span class="score-points">${t.earned} / ${t.max}</span>
        </li>`;
    })
    .join("");

  resultArea.innerHTML = `
    <h2>Результат</h2>
    <div class="score-total">
      Набрано балів: <strong>${earned} з ${max}</strong>
      <span class="score-percent">(${percent}%)</span>
    </div>
    <ul class="score-list">${rows}</ul>
    <button id="restartBtn">Пройти ще раз</button>
  `;

  document.getElementById("restartBtn").onclick = restartTest;
}

function restartTest() {
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("startBtn").style.display = "block";
}