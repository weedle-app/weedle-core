import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/logic/users.service';
import { RegisterUserRequestType } from '../controllers/auth-types';
import ApiAccessKeysRepository from '../repositories/api-access-keys.repository';
import AuthRepository from '../repositories/auth.repository';
import { AuthEntity } from '../entities/auth.entity';
import { AuthDTO } from '../data-objects/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly apiAccessKeysRepository: ApiAccessKeysRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: Partial<AuthEntity>): Promise<{ accessToken: string }> {
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

  async registerUser(requestCtx: RegisterUserRequestType): Promise<AuthDTO> {
    const userExists = await this.authRepository.verifyUserExists(
      requestCtx.username,
    );

    if (userExists) {
      throw new BadRequestException();
    }
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
      await this.apiAccessKeysRepository.createApiKeys(apiKey, serverUrl, auth);

      return this.authRepository.transformEntity<AuthDTO>(auth, AuthDTO);
    }

    throw new BadRequestException();
  }
}
