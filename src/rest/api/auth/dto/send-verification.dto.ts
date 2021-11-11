import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  ValidateIf,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import configuration from '../../../../../config/configuration';

export class SendVerificationDto {
  @ApiProperty({ example: 'test@test.io' })
  @Transform((s) => String(s.value).trim().toLowerCase())
  @ValidateIf((v) => !v.email)
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: 'test@test.io' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly verify_redirect_url: string =
    configuration().service.verify_redirect_url;
}
