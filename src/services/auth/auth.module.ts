import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/logic/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthEntity } from './entities/auth.entity';
import AuthRepository from './repositories/auth.repository';
import { AuthService } from './logic/auth.service';
import { PassportLocalStrategy } from '../../common/auth-strategies/passport-local.strategy';
import { ApiAccessKeysEntity } from './entities/api-access-keys.entity';
import ApiAccessKeysRepository from './repositories/api-access-keys.repository';
import { PassportJwtStrategy } from '../../common/auth-strategies/passport-jwt.strategy';
import { ApiAccessKeysService } from './logic/api-access-keys.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([
      AuthEntity,
      AuthRepository,
      ApiAccessKeysEntity,
      ApiAccessKeysRepository,
    ]),
    JwtModule.register({
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PassportLocalStrategy,
    UsersService,
    PassportJwtStrategy,
    ApiAccessKeysService,
  ],
})
export class AuthModule {}
