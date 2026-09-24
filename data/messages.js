import fs from "node:fs/promises";

// Læser beskeder fra messages.json og laver JSON-teksten om til et JavaScript-array.
export async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf8");
  return JSON.parse(data);
}

// Laver besked-arrayet om til JSON og gemmer det i messages.json.
export async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
}