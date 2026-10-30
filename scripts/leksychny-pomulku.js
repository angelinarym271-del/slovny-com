import { correctPhrases, wrongPhrases } from './lexicalData.js';

const columnsContainer = document.getElementById('leksyka-columns');

// Звʼязуємо два масиви за index: кожна пара — це один рядок
function buildPairs() {
  const pairs = correctPhrases
    .map(correct => {
      const wrong = wrongPhrases.find(w => w.index === correct.index);
      return wrong ? { index: correct.index, correct: correct.phrase, wrong: wrong.phrase } : null;
    })
    .filter(Boolean);

  // сортуємо пари за алфавітом правильного варіанта,
  // пара при цьому лишається цілою (правильне + неправильне в одному рядку)
  pairs.sort((a, b) => a.correct.localeCompare(b.correct, 'uk'));

  return pairs;
}

function renderPairs() {
  const pairs = buildPairs();
  columnsContainer.innerHTML = '';

  pairs.forEach(pair => {
    const correctCell = document.createElement('p');
    correctCell.className = 'leksyka-phrase leksyka-phrase--correct';
    correctCell.textContent = pair.correct;

    const wrongCell = document.createElement('p');
    wrongCell.className = 'leksyka-phrase leksyka-phrase--wrong';
    wrongCell.textContent = pair.wrong;

    columnsContainer.appendChild(correctCell);
    columnsContainer.appendChild(wrongCell);
  });
}

renderPairs();