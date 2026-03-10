import dotenv from "dotenv";
import groq from "../lib/groq.js";

dotenv.config();
function buildPrompt({ url, statusCode, responseTime, incident, bodyPreview }) {
  return `
Summarize this API incident for a developer.

Rules:
- 2 to 4 sentences
- plain English
- mention what happened
- mention likely cause
- mention next action
- do not use bullet points

Data:
URL: ${url}
Status code: ${statusCode ?? "null"}
Response time: ${responseTime ?? "null"} ms
Incident type: ${incident?.type ?? "unknown"}
Severity: ${incident?.severity ?? "unknown"}
Message: ${incident?.message ?? "No message"}
Response preview: ${bodyPreview || "No preview"}
`.trim();
}

const generateAIIncidentSummary = async (data) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(`GROQ_API_KEY is missing`);
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_tokens: 120,
    messages: [
      {
        role: "system",
        content:
          "You are a reliable backend monitoring assistant. Be clear, short, and practical.",
      },
      { role: "user", content: buildPrompt(data) },
    ],
  });

  const text = response.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error(`AI returned empty incident summary`);
  }

  return text;
};

export default generateAIIncidentSummary;
