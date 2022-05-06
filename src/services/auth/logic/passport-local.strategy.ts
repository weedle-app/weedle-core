import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userAuth = await this.authService.validateUserExists(
      username,
      password,
    );
    if (!userAuth) {
      throw new UnauthorizedException();
    }
    return userAuth;
  }
}
