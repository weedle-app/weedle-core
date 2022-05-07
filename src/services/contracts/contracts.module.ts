import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiAccessKeysEntity } from '../auth/entities/api-access-keys.entity';
import ApiAccessKeysRepository from '../auth/repositories/api-access-keys.repository';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './logic/contracts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiAccessKeysEntity, ApiAccessKeysRepository]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
