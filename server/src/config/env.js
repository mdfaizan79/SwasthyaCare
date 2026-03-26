import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../../.env');
const localServerEnvPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: localServerEnvPath, override: false });

const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5001),
  mongoUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(',').map((v) => v.trim()),
  mail: {
    from: process.env.MAIL_FROM ?? 'no-reply@swasthyacare.local',
    transport: process.env.MAIL_TRANSPORT ?? 'smtp',
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 1025),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
};

const required = ['mongoUri', 'jwtAccessSecret', 'jwtRefreshSecret'];

required.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export default env;
