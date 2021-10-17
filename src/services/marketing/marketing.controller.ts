import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { MarketingService } from './marketing.service';

@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}
  @Post()
  async sendPreLaunchMail(
    @Body('email') email: string,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.marketingService.handlePreLaunchRegistration(email, request.ip);
  }
}
