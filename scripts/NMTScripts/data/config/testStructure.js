export default [

  // №1 — Фонетика
  { id: 1, title: "Фонетика", count: 1, type: "single", source: "phonetics" },

  // №2 — Наголос
  { id: 2, title: "Наголос", count: 1, type: "single", source: "stress" },

  // №3–7 — Орфографія тематична (5 питань)
  { id: 3, title: "Орфографія тематична", count: 5, type: "single", source: "orthographyThematic" },

  // №8 — Орфографія підсумкова
  { id: 8, title: "Орфографія підсумкова", count: 1, type: "single", source: "orthographyFinal" },

  // №9 — Морфеміка
  { id: 9, title: "Морфеміка", count: 1, type: "single", source: "morphemics" },

  // №10 — Лексична помилка в словосполученні
  { id: 10, title: "Лексична помилка в словосполученні", count: 1, type: "single", source: "lexicalWordError" },

  // №11 — Потребує редагування речення
  { id: 11, title: "Потребує редагування речення", count: 1, type: "single", source: "editingSentence" },

  // №12 — Пряма мова / Цитати
  { id: 12, title: "Пряма мова / Цитати", count: 1, type: "single", source: "directSpeech" },

  // №13 — Неправильно пояснено розділовий знак
  { id: 13, title: "Неправильно пояснено розділовий знак", count: 1, type: "single", source: "punctuationError" },

  // №14 — Лексична помилка в реченні
  { id: 14, title: "Лексична помилка в реченні", count: 1, type: "single", source: "lexicalSentenceError" },

  // №15 — Лексикологія
  { id: 15, title: "Лексикологія (синонім / іноземні слова)", count: 1, type: "single", source: "lexicology" },

  // №16–20 — Морфологія (5 питань)
  { id: 16, title: "Морфологія", count: 5, type: "single", source: "morphology" },

  // №21–25 — Робота з текстом (5 питань з одного тексту)
  { id: 21, title: "Завдання з текстом", count: 5, type: "multi", source: "textTasks" },

  // №26–30 — Завдання на відповідність
  { id: 26, title: "Фразеологія",                        count: 1, type: "matching", source: "phraseologyPairs" },
  { id: 27, title: "Частини мови",                       count: 1, type: "matching", source: "morphologyPairs" },
  { id: 28, title: "Другорядні члени - підрядні речення", count: 1, type: "matching", source: "syntaxPairs" },
  { id: 29, title: "Умови вживання розділових знаків",    count: 1, type: "matching", source: "punctuationPairs" },
  { id: 30, title: "Типи складних речень",               count: 1, type: "matching", source: "sentenceTypePairs" },

];