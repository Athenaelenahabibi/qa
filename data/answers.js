import fs from "node:fs/promises";

// Læser alle svarregler fra answers.json.
export async function loadAnswers() {
  try {
    const data = await fs.readFile("./data/answers.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Kunne ikke indlæse svarregler.", { cause: error });
  }
}

// Gemmer alle svarregler i answers.json.
export async function saveAnswers(answers) {
  const json = JSON.stringify(answers, null, 2);
  await fs.writeFile("./data/answers.json", json);
}
