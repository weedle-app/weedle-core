export class PasswordResetDto {}
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PasswordReset {
  @ApiProperty({ example: 'test@test.io' })
  @Transform((s) => String(s.value).trim().toLowerCase())
  @ValidateIf((o) => !o.email)
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: '123455 | ksorutoIH' })
  @IsString()
  @IsOptional()
  public password_reset_code: string;

  @ApiProperty({ example: '3820' })
  @IsString()
  @IsOptional()
  @Transform((s) => String(s.value).trim())
  public readonly password: string;

  @ApiProperty({ example: 'lkjhdyuie9376tyu3i3hye3i' })
  @IsOptional()
  @IsString()
  public token: string;
}
