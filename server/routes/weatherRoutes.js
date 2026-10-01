import express from 'express';
import { getWeatherData } from '../services/weatherService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getWeatherData();
    res.json({ weather: data });
  } catch (error) {
    console.error('Weather route error:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});

export default router;
