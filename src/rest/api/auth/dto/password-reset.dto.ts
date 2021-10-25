export class PasswordResetDto {}
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PasswordReset {
  @ApiProperty({ example: 'test@test.io' })
  @Transform((s) => String(s.value).trim().toLowerCase())
  @ValidateIf((o) => !o.email)
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123455 | ksorutoIH' })
  @IsString()
  @IsOptional()
  passwordResetCode: string;

  @ApiProperty({ example: '3820' })
  @IsString()
  @IsOptional()
  @Transform((s) => String(s.value).trim())
  readonly password: string;

  @ApiProperty({ example: 'lkjhdyuie9376tyu3i3hye3i' })
  @IsOptional()
  @IsString()
  token: string;
}
