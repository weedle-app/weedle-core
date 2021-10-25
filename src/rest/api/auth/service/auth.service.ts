import lang from '../../../../lang';
import { Utils } from './../../../../_core/utils/utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BaseService,
  MailService,
  ResponseOption,
  SCryptCryptoFactory,
} from '../../../../_core';
import { ErrorException } from '../../core/exception/error-exception';
import { AuthEntity } from '../entity/auth.entity';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import {
  SendVerificationDto,
  SignUpDto,
  SignInDto,
  ResetCodeDto,
  ChangePassword,
  PasswordReset,
} from '../dto';

@Injectable({})
export class AuthService extends BaseService<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    protected model: Repository<AuthEntity>,
    private userService: UserService,
    private mailService: MailService,
    private jwt: JwtService,
  ) {
    super(model);
  }

  /**
   * @param {SignUpDto} signUpDto: SignUpDto gotten from the payload service
   * @return {Object} returns a saved auth object
   */
  async signUp(signUpDto: SignUpDto) {
    try {
      let auth: AuthEntity = await this.model.findOne({
        email: signUpDto.email,
      });
      if (auth) {
        throw ErrorException.USER_EXIST;
      }
      const authObject: any = {
        ...signUpDto,
        password: signUpDto.password,
        verification: Utils.generateCode(4).toFixed(),
        verification_expiration: Utils.addHourToDate(1),
      };
      auth = await this.model.save({ ...authObject });
      const user = await this.userService.createNewObject({
        auth_id: auth.id,
        auth,
        profile_type: 'customer',
      });
      const token = await this.jwt.sign(AuthService.getJwtPayload(auth, user));
      return {
        auth,
        token,
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {SignInDto} signInDto: SignUpDto gotten from payload
   * @return {Object} returns a saved auth object
   */
  async signIn(signInDto: SignInDto) {
    try {
      const auth = await this.model.findOne(
        { email: signInDto.email },
        { select: ['user'] },
      );
      if (!auth) {
        throw ErrorException.INVALID_CREDENTIALS;
      }
      const isAuthenticated = await SCryptCryptoFactory.compare(
        signInDto.password,
        auth.password,
      );
      if (!isAuthenticated) {
        throw ErrorException.AUTHENTICATION_FAILED;
      }
      return auth;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} data: SignUpDto gotten from payload
   * @param {Object} condition: SignUpDto gotten from payload
   * @return {Object} returns a saved auth object
   */
  async verify(data: any, condition: any) {
    let auth = await this.model.findOne({ ...condition });
    const error = await this.iCanVerify(auth, data);
    if (error instanceof ErrorException) {
      throw error;
    }
    _.extend(auth, {
      verify_code_expiration: null,
      verification_expiration: null,
      account_verified: true,
    });
    auth = await this.model.save(auth);
    return auth;
  }

  /**
   * @param {Object} auth The auth object
   * @param {Object} data The payload data
   * @return {Object} returns error or null for pass
   */
  async iCanVerify(auth: AuthEntity, data: any) {
    if (data.token) {
      const userHash = crypto
        .createHash('md5')
        .update(data.verification_code)
        .digest('hex');
      if (userHash !== data.token) {
        return ErrorException.INVALID_TOKEN;
      }
    } else if (
      !auth ||
      (auth.verification_code &&
        auth.verification_code !== data.verification_code)
    ) {
      return ErrorException.INVALID_TOKEN;
    } else if (auth.account_verified) {
      return ErrorException.ACCOUNT_VERIFIED;
    }
    if (new Date() > auth.verification_expiration) {
      return ErrorException.TOKEN_EXPIRED;
    }
    return null;
  }

  /**
   * @param {SendVerificationDto} payload The access token for verification
   * @return {Promise} The result of the find
   */
  async sendVerifyToken(payload: SendVerificationDto) {
    const auth = await this.model.findOne({ email: payload.email });
    if (!auth) {
      return ErrorException.ACCOUNT_NOT_FOUND;
    }
    if (auth.account_verified) {
      return ErrorException.ACCOUNT_VERIFIED;
    }
    _.extend(auth, {
      verification_expiration: Utils.addHourToDate(1),
      verification_code: Utils.generateCode(4),
    });
    return this.model.save(auth);
  }

  /**
   * @param {SendVerificationDto} payload The access token for verification
   * @return {Promise} The result of the find
   */
  async requestPasswordReset(payload: ResetCodeDto) {
    const auth = await this.model.findOne({ email: payload.email });
    if (!auth) {
      throw ErrorException.ACCOUNT_NOT_FOUND;
    }
    if (auth.account_verified) {
      throw ErrorException.ACCOUNT_VERIFIED;
    }
    _.extend(auth, {
      password_reset_code: Utils.addHourToDate(1),
      password_code_expiration: Utils.generateCode(4),
    });
    return this.model.save(auth);
  }

  /**
   * @param {String} publicId The access token for verification
   * @param {SendVerificationDto} payload The access token for verification
   * @return {Promise} The result of the find
   */
  async changePassword(id: string, payload: ChangePassword) {
    const auth = await this.model.findOne({ id });
    if (!auth) {
      throw ErrorException.ACCOUNT_NOT_FOUND;
    }
    const isAuthenticated = await SCryptCryptoFactory.compare(
      payload.password,
      auth.password,
    );
    if (!isAuthenticated) {
      throw ErrorException.INVALID_CREDENTIALS;
    }
    const password = await SCryptCryptoFactory.hash(payload.password);
    _.extend(auth, { password });
    return await this.model.save(auth);
  }

  /**
   * @param {ResponseOption} option should throw error if true
   * @return {Object} The success response object
   */
  public async getResponse(option: ResponseOption) {
    if (option.email) {
      this.mailService.queueToSendEmail(option.email);
    }
    return super.getResponse(option);
  }

  /**
   * @param {SendVerificationDto} payload The access token for verification
   * @return {Promise} The result of the find
   */
  async resetPassword(payload: PasswordReset) {
    const auth = await this.model.findOne({ email: payload.email });
    if (!auth) {
      return ErrorException.ACCOUNT_NOT_FOUND;
    }
    const error = await this.iCannotResetPassword(auth, payload);
    if (error instanceof Error) {
      throw error;
    }
    const password = await SCryptCryptoFactory.hash(payload.password);
    _.extend(auth, {
      reset_code_expiration: null,
      password_reset_code: null,
      password,
    });
    return await this.model.save(auth);
  }

  /**
   * @param {Object} auth The main property
   * @param {Object} object The object properties
   * @return {Object} returns the main error if main cannot be verified
   */
  async iCannotResetPassword(auth: AuthEntity, object: any) {
    if (!auth) {
      return ErrorException.ERROR(
        lang.get('auth').account_does_not_exist,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!(auth.reset_code_expiration && auth.password_reset_code)) {
      throw ErrorException.ERROR(
        lang.get('auth').password_reset_unauthorized,
        HttpStatus.FORBIDDEN,
      );
    }
    const userHash = crypto
      .createHash('md5')
      .update(auth.password_reset_code)
      .digest('hex');
    if (
      (object.token && userHash !== object.token) ||
      (object.password_reset_code &&
        auth.password_reset_code !== object.password_reset_code)
    ) {
      return ErrorException.ERROR(
        lang.get('auth').password_reset_unauthorized,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (new Date() > auth.reset_code_expiration) {
      return ErrorException.ERROR(
        lang.get('auth').password_reset_link_expired,
        HttpStatus.FORBIDDEN,
      );
    }
    return null;
  }

  /**
   * @param {Object} auth The object properties
   * @param {Object} user The main property
   * @return {Object} returns the main error if main cannot verified
   */
  static getJwtPayload(auth: AuthEntity, user: UserEntity) {
    return {
      auth_id: auth.id,
      email: user.email,
      profile_type: user.profile_type,
    };
  }
}
