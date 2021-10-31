import { ErrorException } from './../../core/exception/error-exception';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as _ from 'lodash';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreException: false,
      secretOrKey: config.get<string>('app.encryption_key'),
    });
  }

  // async validate(payload: any) {
  //   console.log('payload:', payload);
  //   const auth: any = await this.authService.findObject({
  //     id: payload.auth_id,
  //   });
  //   console.log('auth', auth);
  //   if (!auth) {
  //     throw ErrorException.INVALID_TOKEN;
  //   }
  //   return {
  //     ...auth,
  //     // ..._.omit(auth, ['deleted', 'created_at', 'updated_at', 'password']),
  //   };
  // }
}
