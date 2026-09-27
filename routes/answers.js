import express from "express";
import { loadAnswers, saveAnswers } from "../data/answers.js";

// Routeren får /answers som prefix, når den monteres i server.js.
const router = express.Router();

// GET /answers: returnerer alle svarregler.
router.get("/", async (request, response) => {
  const answers = await loadAnswers();

  response.json(answers);
});

// GET /answers/:category: finder en svarregel ud fra kategori.
router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((answer) => answer.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Svarreglen blev ikke fundet." });
    return;
  }

  response.json(answerRule);
});

// POST /answers: opretter og gemmer en ny svarregel.
router.post("/", async (request, response) => {
  const answers = await loadAnswers();
  const { category, keywords, answer } = request.body ?? {};

  if (
    typeof category !== "string" ||
    !category.trim() ||
    !Array.isArray(keywords) ||
    keywords.length === 0 ||
    keywords.some((keyword) => typeof keyword !== "string" || !keyword.trim()) ||
    typeof answer !== "string" ||
    !answer.trim()
  ) {
    response.status(400).json({ error: "category, keywords og answer skal udfyldes korrekt." });
    return;
  }

  const newAnswerRule = {
    category,
    keywords,
    answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  response.status(201).json(newAnswerRule);
});

// PUT /answers/:category: opdaterer en eksisterende svarregel.
router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((answer) => answer.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Svarreglen blev ikke fundet." });
    return;
  }

  const { keywords, answer } = request.body ?? {};
  if (
    !Array.isArray(keywords) ||
    keywords.length === 0 ||
    keywords.some((keyword) => typeof keyword !== "string" || !keyword.trim()) ||
    typeof answer !== "string" ||
    !answer.trim()
  ) {
    response.status(400).json({ error: "keywords og answer skal udfyldes korrekt." });
    return;
  }

  answerRule.keywords = keywords;
  answerRule.answer = answer;
  await saveAnswers(answers);

  response.json(answerRule);
});

// DELETE /answers/:category: sletter en svarregel.
router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((answer) => answer.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Svarreglen blev ikke fundet." });
    return;
  }

  const updatedAnswers = answers.filter((answer) => answer !== answerRule);

  await saveAnswers(updatedAnswers);

  response.status(204).send();
});

export default router;
