import groq from "../lib/groq.js";

async function generateCommitMessage(diff) {
  const prompt = `
    You must generate a git commit message in EXACTLY this format.

    DO NOT add any extra sections.
    DO NOT include the git diff in the output.
    DO NOT add explanations.

    FORMAT:

    <type>: <short summary>

    <longer description explaining what changed and why>

    Changed files/modules:
    - <file1>
    - <file2>

    Notes:
    <optional notes>

    RULES:
    - Strictly follow the format above
    - Do not add "Git diff" section
    - Do not include code blocks
    - Do not include anything outside the format
    - Use conventional commit types (feat, fix, refactor, docs, chore)
    - Keep short summary under 72 characters
    - If the input does not look like a real git diff or does not contain enough concrete file changes, do not guess.
Return exactly:
Unable to generate a reliable commit message from the provided diff. Please paste a real git diff.

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
