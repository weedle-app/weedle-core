import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotEnv from 'dotenv';
dotEnv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.DB_PORT),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
  migrations: ['src/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: '/src/migrations',
  },
};

export = config;
