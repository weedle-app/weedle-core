import { CoreModule } from './rest/api/core/core.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHelperService } from './_core/services/notifications/mail-helper.service';
import { MarketingModule } from './rest/api/marketing/marketing.module';
import { appConfigService } from './_core/services/app-config.service';
import configuration from '../config/configuration';
import { AuthModule } from './rest/api/auth/auth.module';

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
<<<<<<< HEAD
=======
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
>>>>>>> develop
    MarketingModule,
  ],
  controllers: [],
  providers: [MailHelperService],
  // providers: [],
})
export class AppModule {
  // constructor(private readonly connection: Connection) {}
}
