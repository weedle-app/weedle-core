import { AppException } from './../../../../_core';
import { HttpStatus } from '@nestjs/common';
import lang from '../../../../lang';

export enum AuthExceptionStatus {
  AUTH_DATA_NOT_FOUND,
  BASIC_AUTH_INVALID_TOKEN,
  BASIC_AUTH_EXPIRED_TOKEN,
  BASIC_AUTH_ACCOUNT_VERIFIED,
  BASIC_AUTH_MOBILE_VERIFIED,
  BASIC_AUTH_EXPIRED,
}

export class ErrorException extends AppException {
  constructor(error: any, status: number, errorCode: number, message?: string) {
    const customMsg = typeof error === 'string' ? error : message;
    super(customMsg, status, errorCode, null);
  }

  public static ERROR(message, code?: HttpStatus) {
    return new this(message, code || HttpStatus.FAILED_DEPENDENCY, -1);
  }

  public static get USER_CREATION_ERROR() {
    return new this(
      lang.get('users').not_created,
      HttpStatus.FAILED_DEPENDENCY,
      -1,
    );
  }

  public static get ACCOUNT_NOT_FOUND() {
    return new this(
      lang.get('email').account_not_found,
      HttpStatus.UNAUTHORIZED,
      AuthExceptionStatus.AUTH_DATA_NOT_FOUND,
    );
  }

  public static get INVALID_CREDENTIAL() {
    return new this(
      lang.get('auth').auth_failed,
      HttpStatus.UNAUTHORIZED,
      AuthExceptionStatus.AUTH_DATA_NOT_FOUND,
    );
  }

  public static get USER_EXIST() {
    return new this(
      lang.get('auth').email_exist,
      HttpStatus.CONFLICT,
      AuthExceptionStatus.AUTH_DATA_NOT_FOUND,
    );
  }

  public static get INVALID_TOKEN() {
    return new this(
      lang.get('auth').invalid_verify_token,
      HttpStatus.UNAUTHORIZED,
      AuthExceptionStatus.BASIC_AUTH_INVALID_TOKEN,
    );
  }

  public static get TOKEN_EXPIRED() {
    return new this(
      lang.get('auth').verify_token_expired,
      HttpStatus.FORBIDDEN,
      AuthExceptionStatus.BASIC_AUTH_EXPIRED,
    );
  }

  public static get ACCOUNT_VERIFIED() {
    return new this(
      lang.get('auth').account_verified,
      HttpStatus.CONFLICT,
      AuthExceptionStatus.BASIC_AUTH_ACCOUNT_VERIFIED,
    );
  }

  public static get AUTHENTICATION_FAILED() {
    return new this(
      lang.get('auth').authentication_failed,
      HttpStatus.UNAUTHORIZED,
      AuthExceptionStatus.AUTH_DATA_NOT_FOUND,
    );
  }
}
