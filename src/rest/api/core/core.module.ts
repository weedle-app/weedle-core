import { JobService, MailService, WORKER_PROVIDERS } from './../../../_core';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [...WORKER_PROVIDERS, MailService, JobService],
  exports: [...WORKER_PROVIDERS, MailService, JobService],
})
export class CoreModule {}
