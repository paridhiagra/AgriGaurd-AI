import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { calculateDeterministicRecommendation } from './decisionEngine.js';

let aiClient = null;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function getAIRecommendation({
  soilMoisture = 18,
  temperature = 31,
  humidity = 48,
  rainProbability = 20,
  waterLevel = 72,
  crop = 'Wheat (PBW 550)',
  growthStage = 'Vegetative / Tillering'
}) {
  // 1. Primary Deterministic Decision System (Always runs first)
  const deterministicResult = calculateDeterministicRecommendation({
    soilMoisture,
    temperature,
    humidity,
    rainProbability,
    waterLevel,
    crop,
    growthStage
  });

  const ai = getAIClient();

  // If no Gemini API key configured, use deterministic engine immediately
  if (!ai) {
    deterministicResult.note = 'Rule-based decision engine active (Demo Mode)';
    return deterministicResult;
  }

  // 2. Optional Natural Language Explanation via free-tier Gemini
  try {
    const prompt = `System: You are AgriGuard AI. Explain this irrigation decision in 1-2 simple, farmer-friendly sentences.
Crop: ${crop}
Stage: ${growthStage}
Soil Moisture: ${soilMoisture}%
Rain Probability: ${rainProbability}%
Temperature: ${temperature}°C
Decision: ${deterministicResult.decision}
Baseline Reason: ${deterministicResult.reason}

Return ONLY valid JSON matching:
{
  "reason": "1-2 sentence explanation",
  "recommendedAction": "Action advice",
  "confidence": 92
}`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 5000)
    );

    const callPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const response = await Promise.race([callPromise, timeoutPromise]);
    const rawText = response.text?.trim() || '';
    const parsed = JSON.parse(rawText);

    return {
      ...deterministicResult,
      reason: parsed.reason || deterministicResult.reason,
      recommendedAction: parsed.recommendedAction || deterministicResult.recommendedAction,
      confidence: parsed.confidence || deterministicResult.confidence,
      engine: 'AgriGuard Decision Matrix (Gemini-Enhanced)'
    };
  } catch (error) {
    console.log('Gemini explanation unavailable, using deterministic recommendation:', error.message);
    deterministicResult.note = 'AI explanation temporarily unavailable';
    return deterministicResult;
  }
}

export async function askAICopilot({ message, farmContext = {} }) {
  const ai = getAIClient();

  const contextStr = `
Farm Context:
- Farmer: Ramesh Patel
- Farm: ${farmContext.farmName || 'Green Valley Farm, Sector 4, Punjab'}
- Crop: ${farmContext.crop || 'Wheat (PBW 550)'}
- Growth Stage: ${farmContext.growthStage || 'Vegetative (Day 34)'}
- Current Soil Moisture: ${farmContext.soilMoisture ?? 18}%
- Rain Probability: ${farmContext.rainProbability ?? 20}%
- Temperature: ${farmContext.temperature ?? 31}°C
- Humidity: ${farmContext.humidity ?? 48}%
- Tank Level: ${farmContext.tankLevel ?? 72}%
- Current Decision: ${farmContext.currentDecision || 'IRRIGATION_RECOMMENDED'}
`;

  if (!ai) {
    return generateFallbackChatResponse(message, farmContext);
  }

  try {
    const prompt = `System: You are AgriGuard AI Copilot, a friendly agricultural advisor.
${contextStr}

Guidance:
1. Provide practical farming advice tailored to the farmer's current crop and sensor readings.
2. If the user asks in Hindi, answer warmly in Hindi. Otherwise answer in English.
3. Keep the answer concise (2-3 sentences max).
4. If the question is unrelated to farming or weather, politely redirect to farm management.

Farmer's Question: "${message}"`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini Chat API timeout')), 5000)
    );

    const callPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const response = await Promise.race([callPromise, timeoutPromise]);

    return {
      reply: response.text?.trim() || 'I am ready to help with your farm irrigation and crop management.',
      source: 'gemini'
    };
  } catch (err) {
    console.log('Gemini chat unavailable, using agricultural copilot fallback:', err.message);
    return generateFallbackChatResponse(message, farmContext);
  }
}

function generateFallbackChatResponse(message = '', farmContext = {}) {
  const lower = message.toLowerCase();
  const moisture = farmContext.soilMoisture ?? 18;
  const rain = farmContext.rainProbability ?? 20;

  if (lower.includes('पानी') || lower.includes('सिंचाई') || lower.includes('irrigate') || lower.includes('today')) {
    if (rain >= 40) {
      return {
        reply: `बारिश की संभावना ${rain}% है। सिंचाई अभी रोक दें और बारिश का इंतज़ार करें। With ${rain}% rain expected, delaying irrigation is recommended to prevent root waterlogging.`,
        source: 'fallback'
      };
    }
    if (moisture < 25) {
      return {
        reply: `हाँ, आज शाम 6:00 से 8:00 के बीच सिंचाई करना सबसे अच्छा रहेगा क्योंकि नमी सिर्फ ${moisture}% है। Yes! Soil moisture is currently low (${moisture}%). We suggest applying ~35mm tonight between 6:00 PM – 8:00 PM to minimize evaporation loss.`,
        source: 'fallback'
      };
    }
    return {
      reply: `अभी मिट्टी में पर्याप्त नमी (${moisture}%) है। आज अतिरिक्त पानी देने की आवश्यकता नहीं है। Your soil moisture is healthy at ${moisture}%. No irrigation needed today.`,
      source: 'fallback'
    };
  }

  if (lower.includes('moisture') || lower.includes('नमी')) {
    return {
      reply: `Current root-zone soil moisture is ${moisture}%. For wheat in vegetative stage, optimal moisture is 25%-45%. Below 22% initiates plant water stress.`,
      source: 'fallback'
    };
  }

  if (lower.includes('rain') || lower.includes('मौसम') || lower.includes('weather') || lower.includes('बारिश')) {
    return {
      reply: `Weather telemetry indicates ${rain}% rain probability with warm daytime temperature of 31°C. No major precipitation expected until the weekend.`,
      source: 'fallback'
    };
  }

  if (lower.includes('tank') || lower.includes('storage') || lower.includes('टैंक')) {
    return {
      reply: `Your farm water tank storage is at ${farmContext.tankLevel ?? 72}% (42,000L available), which is sufficient for approximately 4 complete irrigation cycles.`,
      source: 'fallback'
    };
  }

  return {
    reply: `AgriGuard AI recommends irrigating your wheat crop tonight between 6:00 PM – 8:00 PM. Current root-zone moisture is ${moisture}% and rain probability is low (${rain}%). Feel free to ask about soil health, weather, or water scheduling!`,
    source: 'fallback'
  };
}
