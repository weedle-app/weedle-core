import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'example@test.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((s) => String(s.value).trim().toLowerCase())
  readonly email: string;

  @ApiProperty({ example: 'FKeys' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((s) => String(s.value).trim().toLowerCase())
  readonly username: string;

  @ApiProperty({ example: 'iowf390pr02030' })
  @IsString()
  @Transform((s) => String(s.value).trim())
  readonly password: string;
}
