import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const config = {
  secretKey: process.env.SECRET_KEY,
  mongoUri: process.env.MONGODB_URI,
  port: process.env.PORT ?? 3000,
};
