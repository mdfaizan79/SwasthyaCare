import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import env from './config/env.js';
import logger from './config/logger.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import sanitizeRequest from './middleware/sanitize.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(compression());
app.use(hpp());
app.use(mongoSanitize());
app.use(sanitizeRequest);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
