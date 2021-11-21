import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirtableService } from '../../../_core/services/airtable.service';
import { MailHelperService } from '../../../_core/services/notifications/mail-helper.service';
import { PreLaunchLeads } from './entities/pre-launch-leads.entity';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreLaunchLeads])],
  providers: [MailHelperService, MarketingService, AirtableService],
  controllers: [MarketingController],
})
export class MarketingModule {}
