import { Injectable } from '@nestjs/common';
import * as Mailchimp from '@mailchimp/mailchimp_marketing';
import { ConfigService } from '@nestjs/config';
import { ConfigFields } from '../../config-types';

@Injectable()
export class MailHelperService {
  private mailChimp = Mailchimp;

  constructor(private configService: ConfigService) {
    this.mailChimp.setConfig({
      apiKey: this.configService.get<string>(ConfigFields.MAILCHIMP_API_KEY),
      server: this.configService.get<string>(
        ConfigFields.MAILCHIMP_SERVER_PREFIX,
      ),
    });
  }

  async sendPreLaunchMail({ email }: { email: string }): Promise<void> {
    return this.mailChimp.lists.addListMember(
      this.configService.get<string>(ConfigFields.MAILCHIMP_PRE_LAUNCH_LISTID),
      {
        email_address: email,
        status: 'subscribed' as Mailchimp.Status,
        email_type: 'html',
        tags: ['Pre-Launch'],
      },
    );
  }
}
