import { AuthEntity } from './../entity/auth.entity';
import { JwtAuthGuard } from './../../../../_core/guards/jwt-auth.guard';
import { VerifyCodeDto } from './../dto/verify-code.dto';
import { JobService } from './../../../../_core/services/job.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, NextFunction } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto';
import * as _ from 'lodash';
import AuthEmail from '../auth.email';
import { CurrentUser } from '../../core/decorators/current-user-decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwt: JwtService,
    private jobService: JobService,
  ) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @Body() signUpDto: SignUpDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { auth, token } = await this.authService.signUp(signUpDto);
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        token,
        value: {
          ..._.omit(auth, ['deleted', 'created_at', 'updated_at']),
        },
        email: AuthEmail.verifyEmail(
          auth,
          auth.verification_code,
          signUpDto.verify_redirect_url,
        ),
      });
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return next(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/sign-up')
  @HttpCode(HttpStatus.OK)
  public async verifyCode(
    @CurrentUser() authUser: AuthEntity,
    @Body() verifyCodeDto: VerifyCodeDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth = await this.authService.verify(verifyCodeDto, {
        id: authUser.id,
      });
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        ..._.omit(auth, ['deleted', 'created_at', 'updated_at']),
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      return next(err);
    }
  }
}
