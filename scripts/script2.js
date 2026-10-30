import { correctPhrases, wrongPhrases } from './lexicalData.js';

window.startLexTest = startLexTest;
window.nextLexTask = nextLexTask;
window.restartLexTest = restartLexTest;

const TOTAL_QUESTIONS = 10;

let current = 0;
let score = 0;
let wrong = 0;
let test = [];
let usedIndexes = [];
let currentTask = null;

function startLexTest() {
  current = 0;
  score = 0;
  wrong = 0;
  usedIndexes = [];

  test = generateTest();

  document.getElementById("startBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("testArea").style.display = "block";

  renderTask(test[current]);
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateTask(type) {
  let options = [];
  let correctPool = shuffle(correctPhrases);
  let wrongPool = shuffle(wrongPhrases);

  if (type === "oneCorrect") {
    let correct = correctPool.find(c => !usedIndexes.includes(c.index));
    usedIndexes.push(correct.index);

    let wrongs = wrongPool.filter(w => w.index !== correct.index).slice(0, 3);
    options = [{ text: correct.phrase, isCorrect: true }, ...wrongs.map(w => ({ text: w.phrase, isCorrect: false }))];
  }

  if (type === "oneWrong") {
    let wrongOption = wrongPool.find(w => !usedIndexes.includes(w.index));
    usedIndexes.push(wrongOption.index);

    let corrects = correctPool.filter(c => c.index !== wrongOption.index).slice(0, 3);
    options = [{ text: wrongOption.phrase, isCorrect: false }, ...corrects.map(c => ({ text: c.phrase, isCorrect: true }))];
  }

  return { type, options: shuffle(options) };
}

function generateTest() {
  const tasks = [];
  for (let i = 0; i < 5; i++) tasks.push(generateTask("oneCorrect"));
  for (let i = 0; i < 5; i++) tasks.push(generateTask("oneWrong"));
  return shuffle(tasks);
}

function renderTask(task) {
  const answers = document.getElementById("answers");
  const question = document.getElementById("question");
  const progress = document.getElementById("progress");

  answers.innerHTML = "";

  question.textContent = task.type === "oneCorrect"
    ? "Оберіть ПРАВИЛЬНЕ словосполучення"
    : "Оберіть НЕПРАВИЛЬНЕ словосполучення";

  progress.textContent = `Завдання ${current + 1} з ${TOTAL_QUESTIONS}`;

  task.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = option.text;
    btn.addEventListener("click", () => checkAnswer(index));
    answers.appendChild(btn);
  });

  currentTask = task;
  document.getElementById("nextBtn").style.display = "none";
}

function checkAnswer(index) {
  const option = currentTask.options[index];
  const buttons = document.querySelectorAll("#answers .answer-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (currentTask.type === "oneCorrect") {
      if (currentTask.options[i].isCorrect) btn.classList.add("correct");
      else if (i === index) btn.classList.add("wrong");
    } else {
      if (!currentTask.options[i].isCorrect) btn.classList.add("correct");
      else if (i === index) btn.classList.add("wrong");
    }
  });

  const isRight = currentTask.type === "oneCorrect" ? option.isCorrect : !option.isCorrect;
  if (isRight) score++;
  else wrong++;

  document.getElementById("nextBtn").style.display = "block";
}

function nextLexTask() {
  current++;
  if (current < TOTAL_QUESTIONS) {
    renderTask(test[current]);
  } else {
    document.getElementById("nextBtn").style.display = "none";
    finishLexTest();
  }
}

function finishLexTest() {
  document.getElementById("question").textContent = "Тест завершено";
  document.getElementById("answers").innerHTML = `
    <strong>Правильних: ${score}</strong> 
    <strong>Неправильних: ${wrong}</strong>
  `;
  document.getElementById("progress").textContent = "";
  document.getElementById("restartBtn").style.display = "block";
}

function restartLexTest() {
  startLexTest();
}