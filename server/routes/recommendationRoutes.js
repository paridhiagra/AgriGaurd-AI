import express from 'express';
import jwt from 'jsonwebtoken';
import { memoryStore } from '../models/memoryStore.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'agriguard_secret_jwt_key_development_2025';

// Safe auth middleware: extracts user if token is present, otherwise falls back to demo user usr_ramesh
function safeAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = memoryStore.users.find(u => u.id === decoded.id || u.email === decoded.email);
      if (user) {
        req.user = { id: user.id, email: user.email, name: user.name, farmName: user.farmName };
      } else {
        req.user = { id: decoded.id || 'usr_ramesh', email: decoded.email, name: decoded.name || 'Farmer Ramesh' };
      }
      return next();
    } catch (_) {
      // Token invalid or expired, fallback to demo user
    }
  }
  req.user = { id: 'usr_ramesh', email: 'ramesh@farm.com', name: 'Ramesh Patel', farmName: 'Green Valley Farm' };
  next();
}

// GET /api/recommendation/history and /api/recommendations/history
// Optional query params: type, crop, limit
router.get('/history', safeAuthMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    let list = memoryStore.recommendations.filter(r => r.userId === userId || r.userId === 'usr_ramesh');

    const { type, crop } = req.query;

    if (type && type !== 'all' && type !== 'All') {
      if (type === 'irrigate' || type === 'IRRIGATION_RECOMMENDED') {
        list = list.filter(r => r.decision === 'IRRIGATION_RECOMMENDED');
      } else if (type === 'wait' || type === 'WAIT_RAIN_EXPECTED') {
        list = list.filter(r => r.decision === 'WAIT_RAIN_EXPECTED');
      } else if (type === 'sufficient' || type === 'NO_IRRIGATION_NEEDED') {
        list = list.filter(r => r.decision === 'NO_IRRIGATION_NEEDED');
      }
    }

    if (crop && crop !== 'all') {
      list = list.filter(r => r.crop.toLowerCase().includes(crop.toLowerCase()));
    }

    // Sort descending by timestamp
    list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      history: list,
      stats: {
        totalWaterSaved: '142k L',
        decisionsCount: list.length,
        healthScore: '94%'
      }
    });
  } catch (error) {
    console.error('History route error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendation history.' });
  }
});

// POST /api/recommendation/history and /api/recommendations/history
// Saves an applied or generated recommendation
router.post('/history', safeAuthMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const {
      soilMoisture,
      temperature,
      humidity,
      rainProbability,
      crop = 'Wheat (PBW 550)',
      growthStage = 'Vegetative / Tillering',
      decision,
      reason,
      recommendedAction,
      keyFactors = [],
      farmerAction = 'Scheduled by Farmer',
      status = 'Pending'
    } = req.body;

    const newRecord = {
      id: 'rec_' + Date.now(),
      userId,
      timestamp: new Date().toISOString(),
      displayDate: 'Just now',
      soilMoisture: Number(soilMoisture),
      temperature: Number(temperature),
      humidity: Number(humidity),
      rainProbability: Number(rainProbability),
      crop,
      growthStage,
      decision,
      reason,
      recommendedAction,
      keyFactors,
      farmerAction,
      status
    };

    memoryStore.recommendations.unshift(newRecord);

    res.status(201).json({
      message: 'Decision saved to farm history log.',
      record: newRecord
    });
  } catch (error) {
    console.error('Save recommendation error:', error);
    res.status(500).json({ error: 'Failed to save recommendation record.' });
  }
});

export default router;
