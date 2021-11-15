import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MailHelperService } from '../../../_core/services/notifications/mail-helper.service';
import { PreLaunchLeads } from './entities/pre-launch-leads.entity';
import { IResponseType } from '../../../helpers/response.helper';
import { AirtableService } from '../../../_core/services/airtable.service';

@Injectable()
export class MarketingService {
  constructor(
    private readonly mailHelperService: MailHelperService,
    @InjectRepository(PreLaunchLeads)
    private preLaunchLeadsEntity: Repository<PreLaunchLeads>,
    private airtableService: AirtableService,
  ) {}

  async handlePreLaunchRegistration(
    email: string,
    ipInformation: string,
  ): Promise<IResponseType> {
    await this.airtableService.createWaitlistRecord({ email });
    try {
      await this.mailHelperService.sendPreLaunchMail({ email });
    } catch (e) {}
    return {
      message: 'User has been created',
    };
  }
}
