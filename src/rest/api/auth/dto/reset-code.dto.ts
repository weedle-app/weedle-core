import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import configuration from '../../../../../config/configuration';

export class ResetCodeDto {
  @ApiProperty({ example: 'test@test.io' })
  @Transform((s) => String(s.value).trim().toLowerCase())
  @ValidateIf((v) => !v.email)
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: 'https://link-to-redirect-to.com/b/redirect' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public redirect_url: string = configuration().service.reset_redirect_url;
}
