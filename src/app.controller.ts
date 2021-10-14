import { Controller, Get } from '@nestjs/common';
/* import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import Sentry from '@sentry/node'; */
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    // TODO - Remove before use, its just an example
    /* sentryClient.instance().captureMessage('message');
    sentryClient
      .instance()
      .captureException(new Error('Some error to test with')); */
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
