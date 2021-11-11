import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignInDto {
  @ApiProperty({ example: 'example@test.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((s) => String(s.value).trim().toLowerCase())
  readonly email: string;

  @ApiProperty({ example: 'iowf390pr02030' })
  @IsString()
  @Transform((s) => String(s.value).trim())
  readonly password: string;
}
