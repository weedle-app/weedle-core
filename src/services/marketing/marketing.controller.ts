import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { MarketingService } from './marketing.service';
import { IResponseType } from '../../helpers/response.helper';

@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}
  @Post()
  async sendPreLaunchMail(
    @Body('email') email: string,
    @Req() request: Request,
  ): Promise<IResponseType> {
    return this.marketingService.handlePreLaunchRegistration(email, request.ip);
  }
}
