import jwt from 'jsonwebtoken';
import { memoryStore } from '../models/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agriguard_secret_jwt_key_development_2025';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = memoryStore.users.find(u => u.id === decoded.id || u.email === decoded.email);
    if (!user) {
      // If user was newly created in session, still grant based on token
      req.user = { id: decoded.id, email: decoded.email, name: decoded.name || 'Farmer Ramesh' };
    } else {
      req.user = { id: user.id, email: user.email, name: user.name, farmName: user.farmName };
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}
