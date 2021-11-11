import { LogLevel } from '@sentry/types';
import { CoreModule } from './rest/api/core/core.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHelperService } from './_core/services/notifications/mail-helper.service';
import { MarketingModule } from './rest/api/marketing/marketing.module';
import { appConfigService } from './_core/services/app-config.service';
import configuration from '../config/configuration';
import { AuthModule } from './rest/api/auth/auth.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ConfigFields } from './config-types';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRoot(appConfigService.getTypeOrmConfig()),
    // SentryModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (cfg: ConfigService) => ({
    //     dsn: cfg.get(ConfigFields.SENTRY_DSN),
    //     debug: false,
    //     environment: cfg.get(ConfigFields.NODE_ENV),
    //     tracesSampleRate: 1.0,
    //     // release: 'some_release', | null, // must create a release in sentry.io dashboard
    //     logLevel: LogLevel.Error, //based on sentry.io loglevel //
    //   }),
    //   inject: [ConfigService],
    // }),
    MarketingModule,
  ],
  controllers: [],
  providers: [MailHelperService],
  // providers: [],
})
export class AppModule {
  // constructor(private readonly connection: Connection) {}
}
