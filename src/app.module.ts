import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigFields } from './config-types';
import { MailHelperService } from './services/mail-service/mail-helper.service';
import { MarketingModule } from './services/marketing/marketing.module';
import * as ormconfig from './config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        dsn: cfg.get(ConfigFields.SENTRY_DSN),
        debug: false,
        environment: cfg.get(ConfigFields.NODE_ENV),
        tracesSampleRate: 1.0,
        // release: 'some_release', | null, // must create a release in sentry.io dashboard
        logLevel: LogLevel.Error, //based on sentry.io loglevel //
      }),
      inject: [ConfigService],
    }),
    MarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailHelperService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
