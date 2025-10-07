// });

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.KEY,
});

const decisionMakerRoles = ["CEO", "Founder", "Head", "Director", "VP", "CMO"];
const influencerRoles = ["Manager", "Lead", "Specialist", "Coordinator"];
const requiredFields = [
  "name",
  "role",
  "company",
  "industry",
  "location",
  "linkedin_bio",
];

function calcRuleScore(lead, offer) {
  let roleScore = 0;
  const role = lead.role || "";
  //role relevance
  if (
    decisionMakerRoles.some((cur) =>
      role.toLowerCase().includes(cur.toLowerCase())
    )
  ) {
    roleScore += 20;
  }

  if (
    influencerRoles.some((cur) =>
      role.toLowerCase().includes(cur.toLowerCase())
    )
  ) {
    roleScore += 10;
  }

  //Industry math
  const industry = lead.industry;

  if (
    offer.ideal_use_cases.some(
      (cur) => industry.toLowerCase() === cur.toLowerCase()
    )
  ) {
    roleScore += 20;
  } else {
    roleScore += 10;
  }
  //checking all field present
  if (
    requiredFields.every(
      (field) => lead[field] && lead[field].toString().trim() !== ""
    )
  ) {
    roleScore += 10;
  }

  return roleScore;
}

async function getAiScore(lead, offer) {
  const prompt = `You are a sales assistant.

Given this product/offer:
${JSON.stringify(offer, null, 2)}

And this prospect:
${JSON.stringify(lead, null, 2)}

Classify the buying intent as High, Medium, or Low and explain in 1-2 sentences.
Respond in JSON:
{ "intent": "...", "reasoning": "..." }
`;

  // const response = await client.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [{ role: "user", content: prompt }],
  // });
  // const aiResult = response.choices[0].message.content;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const aiResult = response.text;
  let parsed;
  try {
    parsed = JSON.parse(aiResult);
  } catch (e) {
    parsed = { intent: "Low", reasoning: "AI response parsing failed" };
  }
  let aiPoints = 0;
  if (parsed.intent === "High") aiPoints = 50;
  else if (parsed.intent === "Medium") aiPoints = 30;
  else aiPoints = 10;

  return { ...parsed, aiPoints };
}

export async function scoreLeads(lead, offer) {
  const ruleScore = calcRuleScore(lead, offer); // from previous step
  const { aiPoints, intent, reasoning } = await getAiScore(lead, offer);

  const finalScore = ruleScore + aiPoints;

  return {
    ...lead,
    ruleScore,
    aiPoints,
    finalScore,
    intent,
    reasoning,
  };
}

// scoreLeads(lead, offer).then((results) => {
//   console.log(results);
// });
