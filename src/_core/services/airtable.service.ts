import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Airtable from 'airtable';

import { ConfigFields } from '../../config-types';

@Injectable()
export class AirtableService {
  private airtable: Airtable;

  private bases = {
    WeedleSupport: {
      id: 'appMJOKj3CS9kk6bK',
      bases: {
        WaitList: 'Waitlist',
      },
    },
  };

  constructor(private configService: ConfigService) {
    this.airtable = new Airtable({
      endpointUrl: this.configService.get<string>(
        ConfigFields.AIRTABLE_ENDPOINT,
      ),
      apiKey: this.configService.get<string>(ConfigFields.AIRTABLE_API_KEY),
    });
  }

  async createWaitlistRecord({ email = '', dateTime = new Date() }) {
    const {
      airtable,
      bases: { WeedleSupport },
    } = this;
    const waitlistBase = airtable.base(WeedleSupport.id)(
      WeedleSupport.bases.WaitList,
    );

    await waitlistBase.create(
      [
        {
          fields: {
            Email: email,
            Date: dateTime.toString(),
          },
        },
      ],
      { typecast: true },
    );
  }
}
