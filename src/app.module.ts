import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigFields } from './config-types';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
