import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('databaseConfig', (): TypeOrmModuleOptions => {
  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    RUN_MIGRATIONS = 'false',
    ENABLE_LOGGING = 'false',
  } = process.env;

  return {
    type: 'postgres',
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
      join(__dirname, '..', '..', 'services', '**', '*.entity{.ts,.js}'),
    ],
    // synchronize: RUN_MIGRATIONS.toLowerCase() === 'true',
    logging: ENABLE_LOGGING.toLowerCase() === 'true',
    migrations: [join(__dirname, '..', '..', 'migrations', '**', '*{.ts,.js}')],
    cli: {
      migrationsDir: join(__dirname, '..', '..', 'migrations'),
    },
  };
});
