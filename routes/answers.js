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

  response.json(answerRule);
});

// POST /answers: opretter og gemmer en ny svarregel.
router.post("/", async (request, response) => {
  const answers = await loadAnswers();
  const newAnswerRule = {
    category: request.body.category,
    keywords: request.body.keywords,
    answer: request.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  response.json(newAnswerRule);
});

// PUT /answers/:category: opdaterer en eksisterende svarregel.
router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((answer) => answer.category === request.params.category);

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});

// DELETE /answers/:category: sletter en svarregel.
router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const updatedAnswers = answers.filter((answer) => answer.category !== request.params.category);

  await saveAnswers(updatedAnswers);

  response.send();
});

export default router;
