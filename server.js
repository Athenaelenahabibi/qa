// Importerer Express og funktionen, der læser beskeder.
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import ejs from "ejs";
import { loadMessages, saveMessages } from "./data/messages.js";
import { findBestAnswer } from "./answerLogic.js";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

// Opretter Express-serveren og vælger porten, som serveren lytter på.
const app = express();
const port = 3000;
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Gør det muligt for serveren at læse JSON-data fra request-body.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(projectRoot, "client"));
app.use("/assets", express.static(path.join(projectRoot, "client")));

// Holder styr på, hvor mange spørgsmål der er stillet om hvert emne.
const topicStats = {
  navn: 0,
  alder: 0,
  bosted: 0,
  fritid: 0
};

// Viser forsiden med de gemte beskeder og statistik over emner.
app.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.render("index", { messages, error: "", topicStats });
});

app.post("/ask", async (request, response) => {
  const messages = await loadMessages();
  const question = typeof request.body.question === "string"
    ? request.body.question.trim()
    : "";

  if (!question) {
    response.render("index", {
      messages,
      error: "Skriv et spørgsmål, før du sender.",
      topicStats
    });
    return;
  }

  const result = await findBestAnswer(question);
  const createdAt = new Date().toISOString();

  messages.push({ type: "question", text: question, createdAt });
  messages.push({ type: "answer", text: result.answer, createdAt: new Date().toISOString() });
  await saveMessages(messages);

  if (result.category) {
    topicStats[result.category] += 1;
  }

  response.render("index", { messages, error: "", topicStats });
});

app.post("/clear-messages", async (request, response) => {
  await saveMessages([]);
  response.redirect("/");
});

// Alle message-routes ligger i denne router og får automatisk /messages som prefix.
app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

// Debug-route, der viser query-parametre fra URL'en.
app.get("/debug", (request, response) => {
  console.log(request.query);
  response.send(request.query);
});

// Debug-route, der viser en dynamisk parameter fra URL'en.
app.get("/debug/:name", (request, response) => {
  console.log(request.params);
  response.send(request.params);
});

app.use((request, response) => {
  response.status(404).json({ error: "Ruten blev ikke fundet." });
});

app.use((error, request, response, next) => {
  console.error(error);
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  response.status(status).json({
    error: status === 500 ? "Der opstod en intern serverfejl." : error.message
  });
});

// Starter serveren og viser adressen i terminalen.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});