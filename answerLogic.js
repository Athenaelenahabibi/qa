import { loadAnswers } from "./data/answers.js";

// Tæller, hvor mange keywords der findes i spørgsmålet.
function countMatches(keywords, normalizedQuestion) {
  return keywords.filter((keyword) => normalizedQuestion.includes(keyword)).length;
}

// Gør spørgsmålet ensartet, så det er lettere at sammenligne med keywords.
function normalizeQuestion(question) {
  return question.trim().toLowerCase().replace(/\s+/g, " ");
}

// Finder det svar med flest matchende keywords.
export async function findBestAnswer(question) {
  const answers = await loadAnswers();
  const normalizedQuestion = normalizeQuestion(question);
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  return {
    answer: bestAnswer,
    category: bestCategory
  };
}
