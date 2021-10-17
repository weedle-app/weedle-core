import * as dotEnv from 'dotenv';
dotEnv.config();

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  username: `${process.env.DB_USERNAME}`,
  port: Number(process.env.DB_PORT),
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
