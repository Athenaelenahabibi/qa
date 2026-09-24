// Importerer Express og funktionen, der læser beskeder.
import express from "express";
import { loadMessages } from "./data/messages.js";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

// Opretter Express-serveren og vælger porten, som serveren lytter på.
const app = express();
const port = 3000;

// Gør det muligt for serveren at læse JSON-data fra request-body.
app.use(express.json());

// Holder styr på, hvor mange spørgsmål der er stillet om hvert emne.
const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

// Viser forsiden med de gemte beskeder og statistik over emner.
app.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.render("index", { messages, error: "", topicStats });
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

// Starter serveren og viser adressen i terminalen.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});