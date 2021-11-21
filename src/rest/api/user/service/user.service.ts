import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../../_core';
import { UserEntity } from '../entity/user.entity';

@Injectable({})
export class UserService extends BaseService<UserEntity> {
  public router = {
    create: false,
    findOne: true,
    update: true,
    remove: false,
  };

  constructor(
    @InjectRepository(UserEntity)
    protected model: Repository<UserEntity>,
  ) {
    super(model);
  }
}
