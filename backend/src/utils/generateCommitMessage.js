import groq from "../lib/groq.js";

async function generateCommitMessage(diff) {
  const prompt = `You must generate a git commit message in exactly this format and not use any other format.

    Line 1:
    <type>: <short summary>

    Line 2:
    <longer description explaining what changed and why>

    Line 3:
    Changed files/modules:
    - <file1>
    - <file2>

    Line 4:
    Notes:
    <optional notes>

    Rules:
    - Do not omit section headers
    - Do not use markdown code fences
    - Do not use any format other than the one above
    - Use conventional commit types like feat, fix, refactor, docs, chore
    - Keep the short summary under 72 characters

    Git diff:
    ${diff}
    `;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_tokens: 200,
    messages: [
      {
        role: "system",
        content: "You strictly follow formatting rules.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    return `chore: update code

No details available

Changed files/modules:
- unknown

Notes:
AI generation failed`;
  }

  return content.trim();
}

export default generateCommitMessage;
