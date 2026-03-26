import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { connectDatabase } from './config/db.js';
import { setSocketServer } from './services/socket.service.js';

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: env.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

setSocketServer(io);

async function bootstrap() {
  await connectDatabase();

  server.listen(env.port, () => {
    logger.info(`API server listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
