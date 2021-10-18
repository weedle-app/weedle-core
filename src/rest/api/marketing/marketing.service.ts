import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MailHelperService } from '../../../_core/services/notifications/mail-helper.service';
import { PreLaunchLeads } from './entities/pre-launch-leads.entity';
import { IResponseType } from '../../../helpers/response.helper';

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
  ): Promise<IResponseType> {
    const preLaunchUser: QueryDeepPartialEntity<PreLaunchLeads> = {
      email,
      extraData: ipInformation || '',
    };

    const userExists = await this.preLaunchLeadsEntity.findOne({ email });
    if (userExists) {
      return {
        message: 'User with these details already exists!',
      };
    }

    this.preLaunchLeadsEntity.insert(preLaunchUser);
    await this.mailHelperService.sendPreLaunchMail({ email });
    return {
      message: 'User has been created',
    };
  }
}
