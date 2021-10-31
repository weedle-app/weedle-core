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
    MarketingModule,
  ],
  controllers: [],
  providers: [MailHelperService],
  // providers: [],
})
export class AppModule {
  // constructor(private readonly connection: Connection) {}
}
