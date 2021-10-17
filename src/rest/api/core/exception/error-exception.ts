import { AppException } from './../../../../_core/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';
import lang from '../../../../lang';

export enum AuthExceptionStatus {
  AUTH_DATA_NOT_FOUND,
  BASIC_AUTH_INVALID_TOKEN,
  BASIC_AUTH_EXPIRED_TOKEN,
  BASIC_AUTH_ACCOUNT_VERIFIED,
  BASIC_AUTH_MOBILE_VERIFIED,
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
      lang.get('auth').account_not_found,
      HttpStatus.UNAUTHORIZED,
      AuthExceptionStatus.AUTH_DATA_NOT_FOUND,
    );
  }
}
