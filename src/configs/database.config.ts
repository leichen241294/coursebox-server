import { registerAs } from '@nestjs/config';

export const localDBConfig = registerAs('localDB', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['"dist/**/*.entity{.ts,.js}"'],
  synchronize: true,
}));
