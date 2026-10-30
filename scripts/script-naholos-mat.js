import { words } from './stressData.js';

const filterSelect = document.getElementById('emphasis-filter');
const column1 = document.getElementById('column-1');
const column2 = document.getElementById('column-2');
const wordsCount = document.getElementById('words-count');

// Повертає масив позицій наголосу (навіть якщо наголос лише один)
function getEmphasisArray(word) {
  return Array.isArray(word.emphasis) ? word.emphasis : [word.emphasis];
}

// Знаходимо всі позиції наголосу, які реально трапляються в базі
// (0-індексовані, як у базі), відсортовані за зростанням
function getUsedEmphasisPositions() {
  const positions = new Set();
  words.forEach(w => {
    getEmphasisArray(w).forEach(pos => positions.add(pos));
  });
  return [...positions].sort((a, b) => a - b);
}

// Чи є в базі хоча б одне слово з подвійним наголосом
function hasDoubleEmphasis() {
  return words.some(w => Array.isArray(w.emphasis) && w.emphasis.length > 1);
}

// Динамічно будує опції випадайки на основі реальних даних бази
function buildFilterOptions() {
  const usedPositions = getUsedEmphasisPositions();

  usedPositions.forEach(pos => {
    const option = document.createElement('option');
    option.value = pos + 1; // людська нумерація (0 у базі -> "1-й склад")
    option.textContent = `${pos + 1}-й склад`;
    filterSelect.appendChild(option);
  });

  if (hasDoubleEmphasis()) {
    const option = document.createElement('option');
    option.value = 'double';
    option.textContent = 'Подвійний наголос';
    filterSelect.appendChild(option);
  }
}

// Витягує пояснення значення в дужках наприкінці назви слова
// "Хаос (безлад)" -> "безлад"
function getMeaning(wordStr) {
  const match = wordStr.match(/\(([^()]+)\)\s*$/);
  return match ? match[1].trim() : null;
}

// Рендерить склади слова, підсвічуючи наголошений(і) та додаючи знак наголосу ˈ
// УВАГА: у базі emphasis рахується з 0 (0 = перший склад, 1 = другий і т.д.)
function renderSyllables(word) {
  const emphasisArr = getEmphasisArray(word);
  return word.syllables
    .map((syl, idx) => {
      return emphasisArr.includes(idx)
        ? `<span class="stress-mark">ˈ</span><span class="stressed">${syl}</span>ˈ`
        : syl;
    })
    .join('');
}

// Фільтрує та сортує слова за алфавітом
// У випадайці значення "людське" (1 = перший склад), а в базі 0-індексоване,
// тому при порівнянні віднімаємо 1
function getFilteredWords(filterValue) {
  let list = [...words];

  if (filterValue === 'double') {
    list = list.filter(w => Array.isArray(w.emphasis) && w.emphasis.length > 1);
  } else if (filterValue !== 'all') {
    const pos = Number(filterValue) - 1;
    list = list.filter(w => getEmphasisArray(w).includes(pos));
  }

  list.sort((a, b) => a.word.localeCompare(b.word, 'uk'));
  return list;
}

// Розбиває список слів на дві колонки та рендерить у DOM
function renderColumns(filterValue) {
  const list = getFilteredWords(filterValue);

  column1.innerHTML = '';
  column2.innerHTML = '';

  const half = Math.ceil(list.length / 2);
  const firstHalf = list.slice(0, half);
  const secondHalf = list.slice(half);

  const fill = (arr, container) => {
    arr.forEach(word => {
      const p = document.createElement('p');
      p.className = 'naholos-word';
      const meaning = getMeaning(word.word);
      const meaningHtml = meaning
        ? ` <span class="word-meaning">(${meaning})</span>`
        : '';
      p.innerHTML = renderSyllables(word) + meaningHtml;
      container.appendChild(p);
    });
  };

  fill(firstHalf, column1);
  fill(secondHalf, column2);

  if (wordsCount) {
    wordsCount.textContent = list.length
      ? `знайдено: ${list.length}`
      : 'нічого не знайдено';
  }
}

filterSelect.addEventListener('change', (e) => renderColumns(e.target.value));

buildFilterOptions();
renderColumns('all');