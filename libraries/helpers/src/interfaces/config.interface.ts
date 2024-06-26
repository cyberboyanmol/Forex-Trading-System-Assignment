export interface Config {
  NODE_ENV: string;
  SERVER: serverConfig;
  DATABASE_URL: string;
  REDIS_URL: string;
  ALLOWED_ORIGINS: Array<string>;
  JWT_ACCESS_TOKEN_EXPIRATION: string;
  JWT_REFRESH_TOKEN_EXPIRATION: string;
  JWT_REFRESH_TOKEN_COOKIE_EXPIRATION: number;
  JWT_ACESS_TOKEN_COOKIE_EXPIRATION: number;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  BCRYPT_SECRET_PEPPER: string;
  ALPHA_VANTAGE_API_KEYS: string;
}

export interface serverConfig {
  HOST: string;
  PORT: number;
}
