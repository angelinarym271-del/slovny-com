export default function normalizeQuestion(q) {
  const base = {
    id: q.id || null,
    type: q.type || "single",
    task: q.task || "",
    question: q.question || q.task || "",
  };

  if (q.type === "single") {
    return {
      ...base,
      options: q.answers || q.options || [],
      correct: q.correct ?? null,
      answerType: q.answerType || "text",
    };
  }

  if (q.type === "matching") {
    return {
      ...base,
      left: q.left || q.cases?.map(c => c.text) || q.sentences || q.simple || [],
      right: q.right || q.examples?.map(e => e.text) || q.options || q.complex || [],
      correctPairs: q.correctPairs || q.correct || {},
    };
  }

  if (q.type === "multi") {
    return {
      ...base,
      // passages — масив [{fig, text}], не об'єкт
      passages: Array.isArray(q.passages) ? q.passages : [],
      answers: q.answers || [],
      answerType: q.answerType || "text",
      correct: q.correct ?? null,
    };
  }

  return { ...base, options: [], correct: null };
}