import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const messages = [];

const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answers: ["Jeg hedder Athena. Hvad vil du ellers vide om mig?"]
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "fra"],
    answers: ["Jeg bor i Aarhus."]
  },
  {
    category: "fritid",
    keywords: ["fritid", "hobby", "kan lide"],
    answers: [
      "I min fritid kan jeg godt lide at læse.",
      "Jeg elsker at gå ture, når vejret tillader det."
    ]
  }
];


function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    // TODO: Returnér true, når spørgsmålet indeholder keyword.
  });

  // TODO: Returnér antallet af matches.
}

console.log(
  countMatches(["navn", "hedder", "hvem er du"], "hvad hedder du?")
); // 1

console.log(
  countMatches(
    ["navn", "hedder", "hvem er du"],
    "hvad hedder du, og hvad er dit navn?"
  )
); // 2

console.log(
  countMatches(["navn", "hedder", "hvem er du"], "kan du bage?")
); // 0


function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    let score = 0;

    for (const keyword of answerGroup.keywords) {
      if (normalizedQuestion.includes(keyword)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      const randomIndex = Math.floor(Math.random() * answerGroup.answers.length);
      bestAnswer = answerGroup.answers[randomIndex];
      bestCategory = answerGroup.category;
    }

  
  }

  return {
    answer: bestAnswer,
    category: bestCategory
  };
}

console.log(findBestAnswer("Hvad hedder du?"));
console.log(findBestAnswer("Kan du bage en kage?"));

function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, "");
}

const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};


app.get("/", (request, response) => {
  response.render("index", { messages, error: "", topicStats });
});

app.get("/debug", (request, response) => {
  console.log(request.query);
  response.send(request.query);
});

app.get("/debug/:name", (request, response) => {
  console.log(request.params);
  response.send(request.params);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.post("/ask", (request, response) => {
  const rawQuestion = request.body.question;
  const question = sanitizeQuestion(rawQuestion).trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else if (question.length > 280) {
    error = "Spørgsmålet må højst være 280 tegn.";
  } else {
    messages.push({ type: "question", text: question, createdAt: new Date() });
    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer, createdAt: new Date() });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
    }
  }

  response.render("index", { messages, error, topicStats });
});

app.post("/clear-messages", (request, response) => {
  messages.length = 0;
  response.redirect("/");
});
