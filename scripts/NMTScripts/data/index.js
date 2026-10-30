import { phonetics } from "./questions/phonetics.js";
import { stress } from "./questions/stress.js";
import { complexSentences } from "./questions/complex_sentence.js";
import { directSpeech } from "./questions/direct_speech.js";
import { editingSentence } from "./questions/editing_sentence.js";
import { lexicalSentenceError } from "./questions/lexical_sent_error.js";
import { lexicalWordError } from "./questions/lexical_word_error.js";
import { lexicology } from "./questions/lexicology.js";
import { morphemics } from "./questions/morphemics.js";
import { morphology } from "./questions/morphology.js";
import { orthographyFinal } from "./questions/orthography_final.js";
import { orthographyThematic } from "./questions/orthography_them.js";
import { phraseology } from "./questions/phraseology.js";
import { punctuationError } from "./questions/punctuation_error.js";
import { punctuationRules } from "./questions/punctuation_rules.js";
import { sentenceParts} from "./questions/syntax.js";
import { textTasks } from "./questions/text_tasks.js";

export default {
  // №1 — Фонетика
  phonetics,

  // №2 — Наголос
  stress,

  // №3–7 — Орфографія тематична
  orthographyThematic,

  // №8 — Орфографія підсумкова
  orthographyFinal,

  // №9 — Морфеміка
  morphemics,

  // №10 — Лексична помилка в словосполученні
  lexicalWordError,

  // №11 — Потребує редагування речення
  editingSentence,

  // №12 — Пряма мова / Цитати
  directSpeech,

  // №13 — Неправильно пояснено розділовий знак
  punctuationError,

  // №14 — Лексична помилка в реченні
  lexicalSentenceError,

  // №15 — Лексикологія
  lexicology,

  // №16–20 — Морфологія (single)
  morphology: morphology.filter(q => q.type === "single"),

  // №21–25 — Робота з текстом
  textTasks,

  // №26–30 — Matching-блоки
  phraseologyPairs: phraseology,
  morphologyPairs:  morphology.filter(q => q.type === "matching"),
  syntaxPairs:      sentenceParts.filter(q => q.type === "matching"),
  punctuationPairs: [...punctuationRules, ...punctuationError].filter(q => q.type === "matching"),
  sentenceTypePairs: complexSentences,
};