

import { words } from './stressData.js';

window.startStressTest = startStressTest;
window.nextStressTask = nextStressTask;

const TOTAL_QUESTIONS = 10;
let testWords = [];    
let results = [];
let currentIndex = 0;  
let correct = 0;        
let wrong = 0;  
let answered ;

function startStressTest() { 
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("testArea").style.display = "block";
  document.getElementById("resultArea").style.display = "none";
  const shuffled = [...words].sort(() => Math.random() - 0.5);

  testWords = shuffled.slice(0, TOTAL_QUESTIONS);

  currentIndex = 0;
  correct = 0;
  wrong = 0;

  showWord();
}



function showWord() {
    document.getElementById("nextBtn").style.display = "none";
    answered = false;

  const wordObj = testWords[currentIndex];
  const container = document.getElementById("syllables");
  const counter = document.getElementById("counter");
  const condition=document.getElementById("condition")
  const wordEl = document.getElementById("word")

  container.innerHTML = "";
  counter.textContent = `Слово ${currentIndex + 1} з ${TOTAL_QUESTIONS}`;
  wordEl.textContent = wordObj.word;
  condition.textContent="Виберіть правильний наголос"


  wordObj.syllables.forEach((syl, index) => {
    const btn = document.createElement("button");
    btn.textContent = syl;

    btn.classList.add("syllable");

    btn.onclick = () => checkAnswer(index);
    container.appendChild(btn);
  });
}



function checkAnswer(selectedIndex) {
 if (answered) return;
  answered = true;

  const wordObj = testWords[currentIndex];
  const buttons = document.querySelectorAll("#syllables button");

  const correctIndexes = Array.isArray(wordObj.emphasis)
    ? wordObj.emphasis
    : [wordObj.emphasis];

  if (correctIndexes.includes(selectedIndex)) {
    correct++;
    buttons[selectedIndex].classList.add("correct");
  } else {
    wrong++;
    buttons[selectedIndex].classList.add("wrong");

    correctIndexes.forEach(i => {
      buttons[i].classList.add("correct");
    });
    results.push(wordObj);    
  }
    document.getElementById("nextBtn").style.display = "block";

  
  updateStats();
}




function updateStats() {
  document.getElementById("correct").textContent = correct;
  document.getElementById("wrong").textContent = wrong;
}

function nextStressTask() {
  if (!answered) return;

  currentIndex++;

  if (currentIndex < TOTAL_QUESTIONS) {
    showWord();
  } else {
    finishTest();
  }
}


function finishTest() {
  document.getElementById("testArea").style.display = "none";

  const resultArea = document.getElementById("resultArea");
  resultArea.style.display = "block";

  let html = `
    <h2>Результат</h2>
    <p>Правильних: ${correct}</p>
    <p>Неправильних: ${wrong}</p>
  `;

  if (results.length > 0) {
    html += "<h3>Помилки у словах:</h3><ul>";

    results.forEach(item => {
      const indexes = Array.isArray(item.emphasis)
        ? item.emphasis
        : [item.emphasis];

      const word = item.syllables
        .map((syl, i) => indexes.includes(i) ? `<b>${syl}</b>` : syl)
        .join("");

      html += `${word}\n`;
    });

    html += "</ul>";
    
  }

  html += `<button id="restartBtn">Пройти ще раз</button>`;

  resultArea.innerHTML = html;

  document.getElementById("restartBtn").onclick = restartTest;
}


function restartTest() {
  document.getElementById("resultArea").style.display = "none";

  currentIndex = 0;
  correct = 0;
  wrong = 0;
  results = [];

  document.getElementById("startBtn").style.display = "block";
}

 function getRandomStressTask() {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const wordObj = shuffled[0]; 
    return {
        type: "emphasis",
        word: wordObj.word,
        syllables: wordObj.syllables,
        emphasis: wordObj.emphasis
    };
}


