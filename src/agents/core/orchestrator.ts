import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  ANALYST_PROMPT, 
  STRATEGIST_PROMPT, 
  EXECUTIVE_PROMPT, 
  COMMUNICATOR_PROMPT 
} from "../prompts";
import { WeatherIntelligence, AutonomousEvent } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function runAutonomousCycle(weatherData: any): Promise<WeatherIntelligence> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest" 
  });

  console.log("Agent Loop: Starting cycle...");
  console.log("Ingested Weather Data:", JSON.stringify(weatherData).substring(0, 200) + "...");

  // Optimized: Single-call multi-agent reasoning to reduce latency
  const reasoningPrompt = `
    You are a Multi-Agent Reasoning System (MARS) for weather safety.
    
    ENVIRONMENTAL DATA:
    ${JSON.stringify(weatherData)}
    
    TASK:
    1. ANALYST: Identify micro-patterns and anomalies in this data.
    2. STRATEGIST: Evaluate risks to human safety and transit based on those patterns.
    3. EXECUTIVE: Decide if action is required.
    
    OUTPUT FORMAT:
    Return ONLY a raw JSON object (no markdown) with this structure:
    {
      "analysis": "string detailing the analyst patterns",
      "strategy": "string detailing the safety assessment",
      "decisions": {
        "actionRequired": boolean,
        "suggestedAction": "string",
        "reasoning": "string",
        "priority": number (1-10)
      }
    }
  `;

  const result = await model.generateContent(reasoningPrompt);
  const rawText = result.response.text();
  
  let intelligenceJson;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : rawText;
    intelligenceJson = JSON.parse(cleanedJson);
  } catch (e) {
    console.error("Agent Logic Error:", e);
    console.error("Raw Text was:", rawText);
    throw new Error("Neural Link Failure: Failed to parse reasoning structure.");
  }

  return {
    timestamp: new Date().toISOString(),
    location: weatherData.name || "Unknown",
    rawMetrics: {
      temp: weatherData.main?.temp,
      humidity: weatherData.main?.humidity,
      pressure: weatherData.main?.pressure,
      windSpeed: weatherData.wind?.speed,
      description: weatherData.weather?.[0]?.description,
    },
    analysis: {
      microPatterns: [intelligenceJson.analysis],
      riskScore: intelligenceJson.decisions.priority,
      threatLevel: intelligenceJson.decisions.priority > 7 ? 'HIGH' : (intelligenceJson.decisions.priority > 4 ? 'MEDIUM' : 'LOW'),
    },
    decisions: intelligenceJson.decisions
  };
}
