import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { memoryStore } from '../models/memoryStore.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'agriguard_secret_jwt_key_development_2025';

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, farmName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide full name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = memoryStore.users.find(u => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      farmName: farmName?.trim() || 'Green Valley Farm',
      createdAt: new Date().toISOString()
    };

    memoryStore.users.push(newUser);

    // Initialize default farm profile for new user
    memoryStore.farms[newUser.id] = {
      id: 'farm_' + newUser.id,
      userId: newUser.id,
      farmName: newUser.farmName,
      location: 'Sector 4, Punjab, India',
      farmSize: '4.8 Hectares',
      crop: 'Wheat (PBW 550)',
      growthStage: 'Vegetative (Day 34)',
      soilType: 'Loamy Silt',
      waterSource: 'Canal Link + Solar Borewell',
      irrigationMethod: 'Micro-Drip In-Line Emitter',
      tankLevel: 72,
      tankCapacity: 42000,
      sensorHealth: 98,
      lastCycleTime: "Y'day 6:30 PM",
      nextOptimalWindow: '6:00 PM – 8:00 PM',
      zoneName: 'Zone 1 • North Sector',
      sensorStation: 'Zone 1: Sensor Station Alpha',
      updatedAt: new Date().toISOString()
    };

    const token = createToken(newUser);

    return res.status(201).json({
      message: 'Your account has been created successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        farmName: newUser.farmName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = memoryStore.users.find(u => u.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    const token = createToken(user);

    return res.json({
      message: 'Welcome back!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        farmName: user.farmName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
