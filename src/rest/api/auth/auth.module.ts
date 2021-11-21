import { JwtAuthGuard } from './../../../_core';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/service/user.service';
import { AuthController } from './controller/auth.controller';
import { AuthEntity } from './entity/auth.entity';
import { AuthService } from './service/auth.service';
import { AuthStrategy } from './service/auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'auth',
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('app.encryption_key'),
        signOptions: {
          //   expiresIn: config.get<number>('service.jwt.expires_in')
          expiresIn: '60d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [CoreModule, AuthService, UserService, AuthStrategy, JwtAuthGuard],
  exports: [AuthService, AuthStrategy],
})
export class AuthModule {}
