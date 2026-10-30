
import { idioms } from './idiomsData.js';

const columnsContainer = document.getElementById('frazeo-columns');

console.log('idioms:', idioms);
console.log('container:', columnsContainer);

function formatMeaning(meaning) {
  if (Array.isArray(meaning)) {
    return meaning.join('; ');
  }

  return meaning ?? '';
}

function renderIdioms() {
  if (!columnsContainer) {
    console.error('Не знайдено #frazeo-columns');
    return;
  }

  if (!Array.isArray(idioms)) {
    console.error('idioms не є масивом:', idioms);
    return;
  }

  // Захищене сортування
  const list = [...idioms].sort((a, b) =>
    String(a.text ?? '').localeCompare(
      String(b.text ?? ''),
      'uk'
    )
  );

  columnsContainer.innerHTML = '';

  list.forEach((idiom) => {
    const termCell = document.createElement('p');
    termCell.className = 'frazeo-phrase frazeo-phrase--term';
    termCell.textContent = idiom.text ?? '';

    const meaningCell = document.createElement('p');
    meaningCell.className = 'frazeo-phrase frazeo-phrase--meaning';
    meaningCell.textContent = formatMeaning(idiom.meaning);

    columnsContainer.appendChild(termCell);
    columnsContainer.appendChild(meaningCell);
  });
}

renderIdioms();
