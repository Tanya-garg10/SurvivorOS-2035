import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface UserProfile {
  name: string;
  profession: string;
  skills: string;
  interests: string;
}

export interface SurvivalStats {
  money: number;
  mentalHealth: number;
  careerSafety: number;
  aiDependency: number;
  adaptability: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  personalityUpdate: string; // New: AI feedback on user's personality
  survivalProbability: number; // New: Overall survival chance %
  choices: {
    text: string;
    impact: Partial<SurvivalStats>;
    consequence: string;
  }[];
}

export interface SurvivalSummary {
  title: string;
  description: string;
  ending: string;
  skillsToLearn: string[];
}

export async function generateScenario(profile: UserProfile, stats: SurvivalStats, decisionHistory: string[] = []): Promise<Scenario> {
  const systemPrompt = `
    You are the game engine for "SurvivorOS 2035". Output ONLY valid JSON.
  `;

  const userPrompt = `
    The year is 2035.
    User: ${profile.name}, ${profile.profession}.
    Skills: ${profile.skills}.
    
    Current Stats:
    Money: ${stats.money}%, Mental Health: ${stats.mentalHealth}%, Career: ${stats.careerSafety}%, AI Dependency: ${stats.aiDependency}%, Adaptability: ${stats.adaptability}%.
    
    Decision History: ${decisionHistory.join(", ")}
    
    1. Generate a personalized AI-disruption scenario.
    2. Provide 3 choices with impacts.
    3. Update "personalityUpdate" based on their history (e.g., "The Pragmatist", "Digital Rebel").
    4. Update "survivalProbability" (0-100) based on stats.
    
    JSON Structure:
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "riskLevel": "Low/Medium/High/Critical",
      "personalityUpdate": "string",
      "survivalProbability": number,
      "choices": [
        { "text": "string", "impact": { "money": number, ... }, "consequence": "string" }
      ]
    }
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
}

export async function generateEnding(profile: UserProfile, stats: SurvivalStats, history: string[]): Promise<SurvivalSummary> {
  const prompt = `
    Generate a cinematic ending for ${profile.name}'s journey in SurvivorOS 2035.
    Final Stats: ${JSON.stringify(stats)}
    History: ${history.join(" -> ")}
    
    Return JSON:
    {
      "title": "Ending Title (e.g. The Digital Fugitive)",
      "description": "2-sentence summary of your personality and state of being.",
      "ending": "A cinematic conclusion paragraph.",
      "skillsToLearn": ["skill 1", "skill 2"]
    }
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
}


