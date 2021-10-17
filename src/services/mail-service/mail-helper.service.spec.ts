import { Test, TestingModule } from '@nestjs/testing';
import { MailHelperService } from '../../_core/services/notifications/mail-helper.service';

describe('MailHelperService', () => {
  let service: MailHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailHelperService],
    }).compile();

    service = module.get<MailHelperService>(MailHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
