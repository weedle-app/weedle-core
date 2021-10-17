/* eslint-disable @typescript-eslint/no-var-requires */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
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
    return mode !== 'production';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue(ConfigFields.DB_HOST),
      port: Number(this.getValue(ConfigFields.DB_PORT)),
      username: this.getValue(ConfigFields.DB_USER),
      password: this.getValue(ConfigFields.DB_PASSWORD),
      database: this.getValue(ConfigFields.DB_NAME),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
      logging: true,
      migrations: ['src/migrations/**/*{.ts,.js}'],
      cli: {
        migrationsDir: '/src/migrations',
      },
      ssl: this.isProduction(),
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
