import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: process.env.DB_AUTO === 'true' ? true : false,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
}));
