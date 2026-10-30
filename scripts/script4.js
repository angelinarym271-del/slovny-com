import { words } from "./stressData.js";
import { correctPhrases, wrongPhrases } from "./lexicalData.js";
import { idioms } from "./idiomsData.js";

window.startDailyTest = startDailyTest;
window.nextDailyTask = nextDailyTask;

// ---------------- НАСТРОЙКИ ----------------

const TOTAL_QUESTIONS = 10;

let dailyTest = [];
let currentIndex = 0;
let correct = 0;
let wrong = 0;
let answered = false;

// ---------------- УТИЛІТИ ----------------

function shuffle(arr){
  return [...arr].sort(()=>Math.random()-0.5);
}

// ---------------- НАГОЛОСИ ----------------

function generateStressTask(){
  const word = shuffle(words)[0];
  return { type:"stress", data: word };
}

// ---------------- ЛЕКСИКА ----------------

function generateLexTask(){

  const type = Math.random() > 0.5 ? "oneCorrect" : "oneWrong";

  const correctPool = shuffle(correctPhrases);
  const wrongPool = shuffle(wrongPhrases);

  let options = [];

  if(type==="oneCorrect"){
    const correctItem = correctPool[0];
    const wrongs = wrongPool.slice(0,3);

    options = [
      {text: correctItem.phrase, isCorrect:true},
      ...wrongs.map(w=>({text:w.phrase, isCorrect:false}))
    ];
  } else {
    const wrongItem = wrongPool[0];
    const corrects = correctPool.slice(0,3);

    options = [
      {text: wrongItem.phrase, isCorrect:false},
      ...corrects.map(c=>({text:c.phrase, isCorrect:true}))
    ];
  }

  return {
    type:"lex",
    data:{
      type,
      options: shuffle(options)
    }
  };
}

// ---------------- ФРАЗЕОЛОГІЯ ----------------

function generatePhraseTask(){

  const typeRand = Math.random();

  // 🔹 значення
  if(typeRand < 0.34){
    const item = shuffle(idioms)[0];

    const correctMeaning = Array.isArray(item.meaning)
      ? item.meaning[Math.floor(Math.random()*item.meaning.length)]
      : item.meaning;

    const pool = idioms.flatMap(i =>
      Array.isArray(i.meaning)?i.meaning:[i.meaning]
    );

    const wrongs = shuffle(pool.filter(p=>p!==correctMeaning)).slice(0,3);

    return {
      type:"phrase",
      data:{
        question: item.text,
        condition:"Оберіть правильне значення",
        options: shuffle([
          {text: correctMeaning, isCorrect:true},
          ...wrongs.map(w=>({text:w, isCorrect:false}))
        ])
      }
    };
  }

  // 🔹 синоніми / антоніми
  const valid = idioms.filter(i=>i.synonyms?.length || i.antonyms?.length);
  const item = shuffle(valid)[0];

  let correctText;
  let condition;

  if(item.synonyms?.length && Math.random()>0.5){
    const found = idioms.find(i=>i.id===item.synonyms[0]);
    correctText = found?.text;
    condition = "Оберіть фразеологізм-синонім до";
  } else {
    const found = idioms.find(i=>i.id===item.antonyms?.[0]);
    correctText = found?.text;
    condition = "Оберіть фразеологізм-антонім до";
  }

  if(!correctText) return generatePhraseTask();

  const pool = idioms.map(i=>i.text).filter(t=>t!==correctText && t!==item.text);
  const wrongs = shuffle(pool).slice(0,3);

  return {
    type:"phrase",
    data:{
      question: item.text,
      condition,
      options: shuffle([
        {text: correctText, isCorrect:true},
        ...wrongs.map(w=>({text:w, isCorrect:false}))
      ])
    }
  };
}

// ---------------- ГЕНЕРАЦІЯ ВСЬОГО ТЕСТУ ----------------

function generateDailyTest(){

  let tasks = [];

  for(let i=0;i<4;i++) tasks.push(generateStressTask());
  for(let i=0;i<3;i++) tasks.push(generateLexTask());
  for(let i=0;i<3;i++) tasks.push(generatePhraseTask());

  return shuffle(tasks);
}

// ---------------- СТАРТ ----------------

function startDailyTest(){
  document.getElementById("startDailyBtn").style.display="none";
  document.getElementById("dailyTestArea").style.display="block";
  document.getElementById("dailyResultArea").style.display="none";
  document.getElementById("dailyRestartBtn").style.display="none";

  dailyTest = generateDailyTest();
  currentIndex = 0;
  correct = 0;
  wrong = 0;

  showDailyTask();
}

// ---------------- ПОКАЗ ----------------

function showDailyTask(){

  const task = dailyTest[currentIndex];

  const counter = document.getElementById("dailyCounter");
  const condition = document.getElementById("dailyCondition");
  const word = document.getElementById("dailyWordOrQuestion");
  const answers = document.getElementById("dailyAnswers");

  counter.textContent = `Завдання ${currentIndex+1} з ${TOTAL_QUESTIONS}`;
  answers.innerHTML = "";
  answered = false;

  // --- НАГОЛОСИ
  if(task.type==="stress"){
    const w = task.data;

    word.textContent = w.word;
    condition.textContent = "Виберіть правильний наголос";

    w.syllables.forEach((syl,i)=>{
      const btn = document.createElement("button");
      btn.textContent = syl;
      btn.className = "dailySyllables";
      btn.onclick = ()=>checkStressAnswer(i,w.emphasis);
      answers.appendChild(btn);
    });
  }

  // --- ЛЕКСИКА
  else if(task.type==="lex"){
    const lex = task.data;

    word.textContent = "";
    condition.textContent = lex.type==="oneCorrect"
      ? "Оберіть правильне словосполучення"
      : "Оберіть неправильне словосполучення";

    lex.options.forEach((opt,i)=>{
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.className = "answer-btn";
      btn.onclick = ()=>checkLexAnswer(i,lex);
      answers.appendChild(btn);
    });
  }

  // --- ФРАЗЕОЛОГІЯ
  else{
    const p = task.data;

    word.textContent = p.question;
    condition.textContent = p.condition;

    p.options.forEach((opt,i)=>{
      const btn = document.createElement("button");
      btn.textContent = opt.text;
      btn.className = "answer-btn";
      btn.onclick = ()=>checkPhraseAnswer(i,p);
      answers.appendChild(btn);
    });
  }

  document.getElementById("dailyNextBtn").style.display="none";
}

// ---------------- ПЕРЕВІРКИ ----------------

function checkStressAnswer(index,correctIndexes){
  if(answered) return;
  answered = true;

  const buttons = document.querySelectorAll("#dailyAnswers button");

  const correctArr = Array.isArray(correctIndexes)?correctIndexes:[correctIndexes];

  if(correctArr.includes(index)){
    correct++;
    buttons[index].classList.add("correct");
  } else {
    wrong++;
    buttons[index].classList.add("wrong");
    correctArr.forEach(i=>buttons[i].classList.add("correct"));
  }

  buttons.forEach(b=>b.disabled=true);
  document.getElementById("dailyNextBtn").style.display="block";
}

function checkLexAnswer(index,lex){
  if(answered) return;
  answered = true;

  const buttons = document.querySelectorAll("#dailyAnswers button");
  const option = lex.options[index];

  let isRight = lex.type==="oneCorrect" ? option.isCorrect : !option.isCorrect;

  if(isRight) correct++; else wrong++;

  buttons.forEach((btn,i)=>{
    btn.disabled=true;

    if(lex.type==="oneCorrect"){
      if(lex.options[i].isCorrect) btn.classList.add("correct");
      else if(i===index) btn.classList.add("wrong");
    } else {
      if(!lex.options[i].isCorrect) btn.classList.add("correct");
      else if(i===index) btn.classList.add("wrong");
    }
  });

  document.getElementById("dailyNextBtn").style.display="block";
}

function checkPhraseAnswer(index,p){
  if(answered) return;
  answered = true;

  const buttons = document.querySelectorAll("#dailyAnswers button");

  if(p.options[index].isCorrect){
    correct++;
    buttons[index].classList.add("correct");
  } else {
    wrong++;
    buttons[index].classList.add("wrong");
    p.options.forEach((o,i)=>{
      if(o.isCorrect) buttons[i].classList.add("correct");
    });
  }

  buttons.forEach(b=>b.disabled=true);
  document.getElementById("dailyNextBtn").style.display="block";
}

// ---------------- ДАЛІ ----------------

function nextDailyTask(){
  currentIndex++;

  if(currentIndex < TOTAL_QUESTIONS){
    showDailyTask();
  } else {
    finishDailyTest();
  }
}

// ---------------- РЕЗУЛЬТАТ ----------------

function finishDailyTest(){
  document.getElementById("dailyTestArea").style.display="none";

  const resultArea = document.getElementById("dailyResultArea");
  resultArea.style.display="block";

  resultArea.innerHTML = `
    <h2>Результат</h2>
    <p>Правильних: ${correct}</p>
    <p>Неправильних: ${wrong}</p>
  `;

  document.getElementById("dailyRestartBtn").style.display="block";
}