import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiAccessKeysService } from '../logic/api-access-keys.service';
import { AuthService } from '../logic/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiAccessKeysService: ApiAccessKeysService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Request() req) {
    return this.authService.registerUser(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/keys/:id')
  async fetchApiKeyById(@Param() params) {
    return this.apiAccessKeysService.getApiKeyById(params.id);
  }
}
