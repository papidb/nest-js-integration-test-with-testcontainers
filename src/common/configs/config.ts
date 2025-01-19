import * as dotenv from 'dotenv';
import { z } from 'zod';
import type { Config } from './config.interface';
dotenv.config();

const config: Config = {
  nest: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
    poolsize: parseInt(process.env.DB_POOLSIZE, 10) || 5,
    ssl: process.env.DB_SSL === 'true',
  },
  environment: process.env.NODE_ENV as Config['environment'],
  app_name: 'gamification',
};

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  DB_HOST: z.string().nonempty('DB_HOST is required'),
  DB_PORT: z.string().transform((val) => parseInt(val, 10)),
  DB_USER: z.string().nonempty('DB_USER is required'),
  DB_NAME: z.string().nonempty('DB_NAME is required'),
  DB_PASSWORD: z.string().nonempty('DB_PASSWORD is required'),
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    required_error:
      "NODE_ENV is required and must be 'development', 'production', or 'test'",
  }),
  ALLOWED_ORIGIN: z.string().nonempty('ALLOWED_ORIGIN is required'),
});

export default (): Config => {
  const env = envSchema.safeParse(process.env);
  if (env.success) {
    return config;
  } else {
    console.error(
      '❌ Environment variable validation failed:',
      env.error.format(),
    );
    process.exit(1); // Exit the application if validation fails
  }
};
