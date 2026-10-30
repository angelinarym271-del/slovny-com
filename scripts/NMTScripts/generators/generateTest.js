import testStructure from "../data/config/testStructure.js";
import database from "../data/index.js";
import { shuffleArray } from "../utils/shuffleArray.js";

export function generateTest() {
  const test = [];

  for (const block of testStructure) {
    const pool = database[block.source];

    if (!pool || pool.length === 0) {
      console.warn(`⚠️ Немає питань для блоку: "${block.title}" (source: "${block.source}")`);
      continue;
    }

    // ── MULTI (текстові завдання) ──
    if (block.type === "multi") {
      const shuffled = shuffleArray(pool);
      const textBlock = shuffled[0]; // беремо один текст

      for (const task of textBlock.tasks) {
        test.push({
          blockId: block.id,
          blockTitle: block.title,
          blockType: "multi",
          passages: textBlock.passages,
          type: "multi",
          id: task.id,
          question: task.question,
          answers: task.answers,
          answerType: task.answerType || "text",
          correct: task.correct,
        });
      }

      continue;
    }

    // ── MATCHING ──
    if (block.type === "matching") {
      const questions = shuffleArray(
        pool.filter(q => q.type === "matching")
      );

      if (questions.length === 0) {
        console.warn(`⚠️ Немає питань типу "matching" для: "${block.title}"`);
        continue;
      }

      const selected = questions.slice(0, block.count);

      for (const q of selected) {
        test.push({
          blockId: block.id,
          blockTitle: block.title,
          blockType: "matching",
          ...q,
        });
      }

      continue;
    }

    // ── SINGLE ──
    const questions = shuffleArray(
      pool.filter(q => q.type === "single")
    );

    if (questions.length === 0) {
      console.warn(`⚠️ Немає питань типу "single" для: "${block.title}"`);
      continue;
    }

    const selected = questions.slice(0, block.count);

    for (const q of selected) {
      test.push({
        blockId: block.id,
        blockTitle: block.title,
        blockType: "single",
        ...q,
      });
    }
  }

  return test;
}