const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getAIScore(productData) {
  const { title, description, brand, category } = productData;

  const prompt = `
You are a sustainability expert analyzing products for eco-friendliness.

Analyze this product and return ONLY a JSON object, no explanation, no markdown backticks:

Product Title: ${title}
Brand: ${brand}
Category: ${category}
Description: ${description}

Return this exact JSON structure:
{
  "score": <number 0-100>,
  "breakdown": {
    "materials":      { "score": <0-30>, "max": 30, "reasoning": "<one line>" },
    "certifications": { "score": <0-25>, "max": 25, "reasoning": "<one line>" },
    "packaging":      { "score": <0-20>, "max": 20, "reasoning": "<one line>" },
    "brand":          { "score": <0-15>, "max": 15, "reasoning": "<one line>" },
    "durability":     { "score": <0-10>, "max": 10, "reasoning": "<one line>" }
  },
  "greenwashingDetected": <true|false>,
  "greenwashingFlags": ["<specific reason if any>"],
  "summary": "<2 sentence plain English summary of sustainability>",
  "improvements": ["<one suggestion>", "<another suggestion>"]
}

Rules:
- Be strict. Vague terms like 'eco-friendly' or 'green' with no certifications = greenwashing.
- Only give high scores for verifiable claims (certifications, specific materials, third-party verified).
- Score 0 if no sustainability info is present in that category.
- Return ONLY the JSON object. No extra text before or after.
`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',  // free, fast Groq model
    max_tokens: 1000,
    temperature: 0.1,          // low temperature = consistent structured output
    messages: [{ role: 'user', content: prompt }]
  });

  const raw = response.choices[0].message.content;

  // Strip any accidental markdown fences and parse
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { getAIScore };