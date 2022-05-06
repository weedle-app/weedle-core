import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/logic/users.service';
import { RegisterUserRequestType } from '../controllers/auth-types';
import ApiAccessKeysRepository from '../repositories/api-access-keys.repository';
import AuthRepository from '../repositories/auth.repository';
import { AuthEntity } from '../entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly apiAccessKeysRepository: ApiAccessKeysRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: Partial<AuthEntity>): Promise<any> {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_TOKEN,
      }),
    };
  }

  async validateUserExists(username: string, password: string): Promise<any> {
    return this.authRepository.getUserAuth(username, password);
  }

  async registerUser(requestCtx: RegisterUserRequestType): Promise<any> {
    const password = await bcrypt.hash(
      requestCtx.password,
      Number(process.env.HASH_SALT),
    );

    const auth = await this.authRepository.createUserAuth(
      requestCtx.username,
      password,
    );

    if (auth) {
      const [apiKey, serverUrl] = [uuidv4(), 'https://someServerurl.com'];
      return this.apiAccessKeysRepository.createApiKeys(
        apiKey,
        serverUrl,
        auth,
      );
    }

    throw new BadRequestException();
  }
}
