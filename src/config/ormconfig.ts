import * as dotEnv from 'dotenv';
dotEnv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { Environments } from '../config-types';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.DB_PORT),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
  synchronize: !(process.env.NODE_ENV === Environments.Production),
  migrationsRun: true,
  logging: true,
  ssl: {
    ca: Buffer.from(process.env.SSL_CERT, 'base64').toString('ascii'),
  },
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  cli: {
    migrationsDir: '/src/migrations',
  },
};

export = config;
