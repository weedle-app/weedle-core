import lang from '../../../../lang';
import { EmailDto } from './../../../../_core/dto/email.dto';
import { SignInDto } from './../dto/sign-in.dto';
import { AuthEntity } from './../entity/auth.entity';
import { JwtAuthGuard } from './../../../../_core/guards/jwt-auth.guard';
import { VerifyCodeDto } from './../dto/verify-code.dto';
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
import {
  ResetCodeDto,
  SendVerificationDto,
  SignUpDto,
  VerifyLinkDto,
  PasswordReset,
  ChangePassword,
} from '../dto';
import * as _ from 'lodash';
import AuthEmail from '../auth.email';
import { CurrentUser } from '../../core/decorators/current-user-decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwt: JwtService,
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
          ..._.omit(auth, ['deleted', 'created_at', 'updated_at', 'password']),
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

  @Post('/verify-code')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async verifyCode(
    // @CurrentUser() { auth_id }: { auth_id: string; email: string },
    @Body() verifyCodeDto: VerifyCodeDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth = await this.authService.verify(verifyCodeDto, {
        email: verifyCodeDto.email,
      });
      console.log('auth:', auth);
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        value: {
          ..._.omit(auth, ['deleted', 'created_at', 'updated_at', 'password']),
        },
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (err) {
      console.log('err:', err);
      return next(err);
    }
  }

  @Post('/verify-link')
  @HttpCode(HttpStatus.OK)
  public async verifyLink(
    @Body() verifyLinkDto: VerifyLinkDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth = await this.authService.verify(
        verifyLinkDto,
        {
          email: verifyLinkDto.email,
        },
        'link',
      );
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        value: {
          email: auth.email,
          account_verified: auth.account_verified,
        },
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { auth } = await this.authService.signIn(signInDto);
      const token = this.jwt.sign(AuthService.getJwtPayload(auth));
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        token,
        value: {
          ..._.omit(auth, ['deleted', 'password']),
        },
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }

  @Post('/send-verify/email')
  @HttpCode(HttpStatus.OK)
  public async sendVerifyToEmail(
    @Body() emailDto: EmailDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth: any = await this.authService.sendVerifyToken(<
        SendVerificationDto
      >{
        email: emailDto.email,
      });
      console.log('auth:', auth);
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        message: lang.get('auth').verify_email_sent,
        value: {
          email: emailDto.email,
        },
        email: AuthEmail.verifyEmail(
          auth as AuthEntity,
          auth.verification_code,
        ),
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      console.log('e:', e);
      return next(e);
    }
  }

  @Post('/password/request')
  @HttpCode(HttpStatus.OK)
  public async passwordReset(
    @Body() resetCodeDto: ResetCodeDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth = await this.authService.requestPasswordReset(resetCodeDto);
      console.log('req-auth', auth);
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        value: {
          email: auth.email,
          success: true,
        },
        email: AuthEmail.resetPasswordEmail(auth, auth.password_reset_code),
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }

  @Post('/password/reset')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(
    @Body() passwordResetDto: PasswordReset,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth = await this.authService.resetPassword(passwordResetDto);
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        message: lang.get('auth').verification_code_resent,
        // message: 'An email has been sent to you',
        value: {
          email: auth['email'],
          success: true,
        },
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @CurrentUser() authUser: AuthEntity,
    @Body() changePassword: ChangePassword,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const auth = await this.authService.changePassword(
        authUser.id,
        changePassword,
      );
      const response = await this.authService.getResponse({
        code: HttpStatus.OK,
        value: {
          email: auth.email,
          success: true,
        },
      });
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      return next(e);
    }
  }
}
