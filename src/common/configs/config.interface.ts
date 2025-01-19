export interface Config {
  nest: NestConfig;
  database: DatabaseConfig;
  environment: 'development' | 'production' | 'test';
  app_name: string;
}

export interface NestConfig {
  port: number;
}

export interface DatabaseConfig {
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  ssl: boolean;
  poolsize: number;
  idleTimeout: number;
}

export interface CacheConfig {
  url: string;
}
