import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";
const model = process.env.OPENAI_MODEL || "gpt-5";

const client = apiKey ? new OpenAI({ apiKey }) : null;

export function isOpenAIReady() {
  return Boolean(client);
}

const fallbackTutor = { reply: "", hints: [], escalation: false };

const fallbackExercise = (skillId, difficulty) => ({
  id: "",
  skillId,
  difficulty,
  prompt: "What is 3 + 4?",
  choices: ["6", "7", "8", "9"],
  answer: "7",
  meta: { source: "fallback" }
});

export async function generateTutorReply({ message }) {
  if (!client) return fallbackTutor;

  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a friendly AI tutor for children ages 6-14. Be concise, encouraging, and safe. Avoid sensitive topics."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_output_tokens: 200
    });

    const reply = response.output_text || "";
    return { reply, hints: [], escalation: false };
  } catch (err) {
    return fallbackTutor;
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export async function generateExercise({ skillId, difficulty }) {
  if (!client) {
    return fallbackExercise(skillId, difficulty);
  }

  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You create short, age-appropriate exercises. Return ONLY JSON with keys: prompt, choices, answer."
        },
        {
          role: "user",
          content: `Skill: ${skillId}. Difficulty: ${difficulty || 1}. Make one multiple-choice exercise.`
        }
      ],
      max_output_tokens: 200
    });

    const json = safeJsonParse(response.output_text || "");
    if (!json || !json.prompt || !Array.isArray(json.choices)) {
      return fallbackExercise(skillId, difficulty);
    }

    return {
      id: "",
      skillId,
      difficulty,
      prompt: json.prompt,
      choices: json.choices,
      answer: json.answer || "",
      meta: { source: "openai" }
    };
  } catch (err) {
    return fallbackExercise(skillId, difficulty);
  }
}
