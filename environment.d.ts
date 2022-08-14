import { Dialect } from 'sequelize';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      GUILD_ID: string;
      ENVIRONMENT: 'dev' | 'prod' | 'debug';
      DB_LOG: boolean;
      DB_TYPE: Dialect;
      DB_HOSTNAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      DB_PORT: string;
    }
  }
}

export {};
