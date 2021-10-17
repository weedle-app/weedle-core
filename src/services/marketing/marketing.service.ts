import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MailHelperService } from '../mail-service/mail-helper.service';
import { PreLaunchLeads } from './entities/pre-launch-leads.entity';

@Injectable()
export class MarketingService {
  constructor(
    private readonly mailHelperService: MailHelperService,
    @InjectRepository(PreLaunchLeads)
    private preLaunchLeadsEntity: Repository<PreLaunchLeads>,
  ) {}

  async handlePreLaunchRegistration(
    email: string,
    ipInformation: string,
  ): Promise<boolean> {
    const preLaunchUser: QueryDeepPartialEntity<PreLaunchLeads> = {
      email,
      extraData: ipInformation || '',
    };
    console.log({ preLaunchUser });
    this.preLaunchLeadsEntity.insert(preLaunchUser);
    await this.mailHelperService.sendPreLaunchMail({ email });
    return true;
  }
}
