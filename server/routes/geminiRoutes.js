import express from 'express';
import { getAIRecommendation, askAICopilot } from '../services/geminiService.js';

const router = express.Router();

// POST /api/gemini/recommendation
router.post('/recommendation', async (req, res) => {
  try {
    const {
      soilMoisture = 18,
      temperature = 31,
      humidity = 48,
      rainProbability = 20,
      waterLevel = 72,
      crop = 'Wheat (PBW 550)',
      growthStage = 'Vegetative / Tillering'
    } = req.body;

    const recommendation = await getAIRecommendation({
      soilMoisture,
      temperature,
      humidity,
      rainProbability,
      waterLevel,
      crop,
      growthStage
    });

    res.json(recommendation);
  } catch (error) {
    console.error('Gemini recommendation API error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendation',
      fallback: true
    });
  }
});

// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, farmContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const response = await askAICopilot({
      message: message.trim(),
      farmContext: farmContext || {}
    });

    res.json(response);
  } catch (error) {
    console.error('Gemini chat API error:', error);
    res.status(500).json({
      reply: 'AgriGuard AI is currently analyzing soil and sensor telemetry. How else may I assist with your crops?',
      source: 'fallback'
    });
  }
});

export default router;
