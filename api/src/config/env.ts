import dotenv from 'dotenv';

dotenv.config();

const required = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing env vars: ${missing.join(', ')}`);
}

export const env = {
  port: Number(process.env.PORT),
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  adminSeedKey: process.env.ADMIN_SEED_KEY ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development'
};
