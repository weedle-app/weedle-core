import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHelperService } from '../mail-service/mail-helper.service';
import { PreLaunchLeads } from './entities/pre-launch-leads.entity';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreLaunchLeads])],
  providers: [MailHelperService, MarketingService],
  controllers: [MarketingController],
})
export class MarketingModule {}
