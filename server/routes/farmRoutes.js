import express from 'express';
import { memoryStore } from '../models/memoryStore.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/farm
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  let farm = memoryStore.farms[userId];

  if (!farm) {
    // If not found, use default demo farm with user's name
    farm = {
      id: 'farm_' + userId,
      userId: userId,
      farmName: req.user.farmName || 'Green Valley Farm',
      location: 'Sector 4, Green Valley, Punjab',
      farmSize: '4.8 Hectares',
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative (Day 34)',
      soilType: 'Loamy Silt with High Water Retention',
      waterSource: 'Canal Link + Solar Borewell',
      irrigationMethod: 'Micro-Drip In-Line Emitter',
      tankLevel: 72,
      tankCapacity: 42000,
      sensorHealth: 98,
      lastCycleTime: "Y'day 6:30 PM",
      nextOptimalWindow: '6:00 PM – 8:00 PM',
      zoneName: 'Zone 1 • North Sector',
      sensorStation: 'Zone 1: Sensor Station Alpha (15cm & 30cm Depth)',
      updatedAt: new Date().toISOString()
    };
    memoryStore.farms[userId] = farm;
  }

  res.json({ farm });
});

// PUT /api/farm
router.put('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const currentFarm = memoryStore.farms[userId] || {};

  const updatedFarm = {
    ...currentFarm,
    ...req.body,
    userId: userId,
    updatedAt: new Date().toISOString()
  };

  memoryStore.farms[userId] = updatedFarm;

  res.json({
    message: 'Farm details updated successfully.',
    farm: updatedFarm
  });
});

export default router;
