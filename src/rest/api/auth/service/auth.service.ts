import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService, ErrorException } from '../../../../_core';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthEntity } from '../entity/auth.entity';

@Injectable({})
export class AuthService extends BaseService<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    protected model: Repository<AuthEntity>,
  ) {
    super(model);
  }

  /**
   * @param {SignUpDto} signUpDto: SignUpDto gotten from the payload service
   * @return {Object} returns a saved auth object
   */
  async signUp(signUpDto: SignUpDto) {
    try {
      const auth: AuthEntity = await this.model.findOne({
        email: signUpDto.email,
      });
      if (auth) {
        // throw ErrorException.USER_EXIST;
      }
    } catch (e) {
      throw e;
    }
  }
}
