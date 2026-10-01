import { createServer } from './server/server.js';

createServer().catch(err => {
  console.error('Failed to start AgriGuard AI server:', err);
  process.exit(1);
});
