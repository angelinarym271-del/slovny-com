import normalizeQuestion from "../utils/normalizeQuestion.js";

export function renderMatching(question, container, onAnswer, savedAnswer) {
  const q = normalizeQuestion(question);

  container.innerHTML = "";

  // Завдання
  const task = document.createElement("h2");
  task.className = "question-task";
  task.innerHTML = q.task; // <-- Змінено textContent на innerHTML
  container.appendChild(task);

  const leftItems = q.left;   // 4 штуки
  const rightItems = q.right; // 5 штук
  const colLetters = ["А", "Б", "В", "Г", "Д"].slice(0, rightItems.length);

  const userPairs = savedAnswer ? { ...savedAnswer } : {};

  // ── Два списки поруч ──
  const listsWrapper = document.createElement("div");
  listsWrapper.className = "matching-lists";

  // Лівий список (1, 2, 3, 4)
  const leftList = document.createElement("div");
  leftList.className = "matching-list";

  leftItems.forEach((item, i) => {
    const p = document.createElement("p");
    p.className = "matching-list-item";
    p.innerHTML = `<b>${i + 1}</b> ${item}`;
    leftList.appendChild(p);
  });

  // Правий список (А, Б, В, Г, Д)
  const rightList = document.createElement("div");
  rightList.className = "matching-list";

  rightItems.forEach((item, j) => {
    const p = document.createElement("p");
    p.className = "matching-list-item";
    p.innerHTML = `<b>${colLetters[j]}</b> ${item}`;
    rightList.appendChild(p);
  });

  listsWrapper.appendChild(leftList);
  listsWrapper.appendChild(rightList);
  container.appendChild(listsWrapper);

  // ── Таблиця відповідностей ──
  const table = document.createElement("table");
  table.className = "matching-table";

  // Шапка таблиці
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  headRow.appendChild(document.createElement("th"));

  colLetters.forEach(letter => {
    const th = document.createElement("th");
    th.textContent = letter;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  // Тіло таблиці
  const tbody = document.createElement("tbody");

  leftItems.forEach((_, rowIndex) => {
    const tr = document.createElement("tr");

    // Номер рядка
    const tdNum = document.createElement("td");
    tdNum.className = "matching-row-num";
    tdNum.textContent = rowIndex + 1;
    tr.appendChild(tdNum);

    // Клітинки вибору
    colLetters.forEach((_, colIndex) => {
      const td = document.createElement("td");
      td.className = "matching-cell";

      if (userPairs[rowIndex] === colIndex) {
        td.classList.add("selected");
      }

      td.addEventListener("click", () => {
        tr.querySelectorAll(".matching-cell").forEach(cell =>
          cell.classList.remove("selected")
        );

        td.classList.add("selected");
        userPairs[rowIndex] = colIndex;

        onAnswer({ ...userPairs });
      });

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}