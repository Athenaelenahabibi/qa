// Importerer Express og funktionerne, der læser og gemmer beskeder.
import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { findBestAnswer } from "../answerLogic.js";

// Routeren får /messages som prefix, når den monteres i server.js.
const router = express.Router();

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// GET /messages: returnerer alle gemte beskeder.
router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});

// POST /messages: gemmer spørgsmålet og det genererede svar.
router.post("/", async (request, response) => {
  const messages = await loadMessages();
  const question = request.body.question.trim();

  if (!question) {
    response.status(400).json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const message = { type: "question", text: escapeHtml(question), createdAt: new Date().toISOString() };
  messages.push(message);

  const result = await findBestAnswer(question);
  const answerMessage = { type: "answer", text: escapeHtml(result.answer), createdAt: new Date().toISOString() };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.status(201).json({ question: message, answer: answerMessage });
});

// DELETE /messages: sletter alle gemte beskeder.
router.delete("/", async (request, response) => {
  await saveMessages([]);

  response.status(204).send();
});

// Gør routeren tilgængelig for server.js.
export default router;
