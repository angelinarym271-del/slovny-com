import { idioms } from "./idiomsData.js";

window.startPhraseTest = startPhraseTest;
window.nextPhraseTask = nextPhraseTask;
window.selectCell = selectCell;

const numRows = 4;
const numCols = 5;
const totalTasks = 5;
const letters = ["А","Б","В","Г","Д"];

let task;
let userPairs = {};
let taskCount = 1;
let totalCorrect = 0;
let showingResult = false;

// ---------------- УТИЛІТИ ----------------

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomItems(array, n) {
  return shuffle(array).slice(0, n);
}

function getUniqueRandom(array, n) {
  return shuffle([...new Set(array)]).slice(0, n);
}

// ---------------- СТРОГИЙ БІЛДЕР ----------------

function buildTaskStrict(leftItems, correctItems, pool) {

  const uniquePool = [...new Set(pool)].filter(p => !correctItems.includes(p));

  if (uniquePool.length < 1) {
    return buildTaskStrict(leftItems, correctItems, pool);
  }

  const extra = uniquePool[Math.floor(Math.random() * uniquePool.length)];

  let allOptions = [...correctItems, extra];
  allOptions = [...new Set(allOptions)];

  if (allOptions.length < 5) {
    return buildTaskStrict(leftItems, correctItems, pool);
  }

  const topItems = shuffle(allOptions);

  const answers = {};

  for (let r = 0; r < numRows; r++) {
    const index = topItems.indexOf(correctItems[r]);

    if (index === -1) {
      return buildTaskStrict(leftItems, correctItems, pool);
    }

    answers[r] = index;
  }

  return { leftItems, topItems, answers };
}

// ---------------- ГЕНЕРАЦІЯ ----------------

// --- Значення
function generateTranslationTask() {

  const items = getRandomItems(idioms, numRows);

  const leftItems = items.map(i => i.text);

  const meanings = items.map(i =>
    Array.isArray(i.meaning)
      ? i.meaning[Math.floor(Math.random() * i.meaning.length)]
      : i.meaning
  );

  const pool = idioms.flatMap(i =>
    Array.isArray(i.meaning) ? i.meaning : [i.meaning]
  );

  return {
    type: "Оберіть правильне значення",
    ...buildTaskStrict(leftItems, meanings, pool)
  };
}

// --- Синоніми
function generateSynonymTask() {

  const valid = idioms.filter(i => i.synonyms?.length);

  let pairs = [];

  valid.forEach(item => {
    item.synonyms.forEach(id => {
      const found = idioms.find(i => i.id === id);
      if (found && found.text !== item.text) {
        pairs.push({ base: item.text, syn: found.text });
      }
    });
  });

  if (pairs.length < numRows) return generateTranslationTask();

  const selected = getRandomItems(pairs, numRows);

  const leftItems = selected.map(i => i.base);
  const synonyms = selected.map(i => i.syn);

  const pool = pairs.map(p => p.syn);

  return {
    type: "Оберіть фразеологізм-синонім",
    ...buildTaskStrict(leftItems, synonyms, pool)
  };
}

// --- Антоніми
function generateAntonymTask() {

  const valid = idioms.filter(i => i.antonyms?.length);

  let pairs = [];

  valid.forEach(item => {
    const found = idioms.find(i => i.id === item.antonyms[0]);
    if (found && found.text !== item.text) {
      pairs.push({ base: item.text, ant: found.text });
    }
  });

  if (pairs.length < numRows) return generateTranslationTask();

  const selected = getRandomItems(pairs, numRows);

  const leftItems = selected.map(i => i.base);
  const antonyms = selected.map(i => i.ant);

  const pool = pairs.map(p => p.ant);

  return {
    type: "Оберіть фразеологізм-антонім",
    ...buildTaskStrict(leftItems, antonyms, pool)
  };
}

// --- Вибір типу
function generateTask() {
  const types = [
    generateTranslationTask,
    generateSynonymTask,
    generateAntonymTask
  ];
  return types[(taskCount - 1) % 3]();
}

// ---------------- СТАРТ ----------------

function startPhraseTest() {
  taskCount = 1;
  totalCorrect = 0;
  showingResult = false;

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("testArea").style.display = "block";
  document.getElementById("resultArea").style.display = "none";

  task = generateTask();
  showTask();
}

// ---------------- ВІДОБРАЖЕННЯ ----------------

function showTask() {

  document.getElementById("progress").textContent =
    `Завдання ${taskCount} з ${totalTasks}`;

  document.getElementById("tableArea").innerHTML =
    `<p><strong>${task.type}</strong></p>`;

  document.getElementById("leftOptions").innerHTML =
    task.leftItems.map((t,i)=>`${i+1}. ${t}`).join("<br>");

  document.getElementById("topOptions").innerHTML =
    task.topItems.map((t,i)=>`${letters[i]}. ${t}`).join("<br>");

  let html = `<table class="match-table"><tr><th></th>`;

  for (let i = 0; i < numCols; i++) {
    html += `<th>${letters[i]}</th>`;
  }

  html += `</tr>`;

  for (let r = 0; r < numRows; r++) {
    html += `<tr><th>${r+1}</th>`;
    for (let c = 0; c < numCols; c++) {
      html += `<td onclick="selectCell(${r},${c},this)"></td>`;
    }
    html += `</tr>`;
  }

  html += `</table>`;

  document.getElementById("tableArea").innerHTML += html;

  userPairs = {};
  showingResult = false;

  document.getElementById("nextBtn").disabled = true;
}

// ---------------- ВИБІР ----------------

function selectCell(row, col, cell) {

  const tr = cell.parentElement;

  tr.querySelectorAll("td").forEach(td => {
    td.innerText = "";
    td.classList.remove("selected");
  });

  for (let r in userPairs) {
    if (userPairs[r] === col) delete userPairs[r];
  }

  cell.innerText = "✔";
  cell.classList.add("selected");

  userPairs[row] = col;

  document.getElementById("nextBtn").disabled =
    Object.keys(userPairs).length !== numRows;
}

// ---------------- НАСТУПНЕ ----------------

function nextPhraseTask() {

  if (!showingResult) {

    let correctNow = 0;

    for (let r = 0; r < numRows; r++) {

      const correctCol = task.answers[r];
      const tr = document.querySelectorAll("tr")[r + 1];

      if (userPairs[r] === correctCol) {
        tr.children[correctCol + 1].classList.add("correct");
        correctNow++;
      } else {
        if (userPairs[r] != null) {
          tr.children[userPairs[r] + 1].classList.add("wrong");
        }
        tr.children[correctCol + 1].classList.add("correct");
      }
    }

    totalCorrect += correctNow;
    showingResult = true;
    return;
  }

  taskCount++;

  if (taskCount > totalTasks) {
    finishTest();
    return;
  }

  task = generateTask();
  showTask();
}

// ---------------- РЕЗУЛЬТАТ ----------------

function finishTest() {
  document.getElementById("testArea").style.display = "none";

  const result = document.getElementById("resultArea");
  result.style.display = "block";

  result.innerHTML = `
    <h2>Результат</h2>
    <p>${totalCorrect} / ${totalTasks * numRows}</p>
    <button id="restartBtn" onclick="startPhraseTest()">Пройти ще раз</button>
  `;
}