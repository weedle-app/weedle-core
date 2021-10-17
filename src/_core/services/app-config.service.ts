/* eslint-disable @typescript-eslint/no-var-requires */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as appRootPath from 'app-root-path';
import { ConfigFields } from 'src/config-types';

require('dotenv').config();

export class AppConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((key: string) => this.getValue(key, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue(ConfigFields.NODE_ENV, false);
    return mode === 'production';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: `${process.env.DB_HOST}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_NAME}`,
      entities: ['dist/**/*.entity.js'],
      // [join(appRootPath.toString(), '/**/**.entity{.ts,.js}')],
      synchronize: !this.isProduction(),
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
  }
}
const appConfigService = new AppConfigService(process.env).ensureValues([
  ConfigFields.DB_HOST,
  ConfigFields.DB_PORT,
  ConfigFields.DB_USER,
  ConfigFields.DB_PASSWORD,
  ConfigFields.DB_NAME,
  ConfigFields.NODE_ENV,
]);

export { appConfigService };
