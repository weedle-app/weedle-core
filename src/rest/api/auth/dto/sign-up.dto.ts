import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @Transform((s) => String(s.value).trim().toLowerCase())
  public readonly first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @Transform((s) => String(s.value).trim().toLowerCase())
  public readonly last_name: string;

  @ApiProperty({ example: 'example@test.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((s) => String(s.value).trim().toLowerCase())
  public readonly email: string;

  @ApiProperty({ example: 'FKeys' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((s) => String(s.value).trim().toLowerCase())
  public readonly username: string;

  @ApiProperty({ example: 'iowf390pr02030' })
  @IsString()
  @Transform((s) => String(s.value).trim())
  public readonly password: string;

  @ApiProperty({ example: 'https://link-you-want-to-redirect-user/verify' })
  @IsString()
  @Transform((s) => String(s.value).trim())
  public readonly verify_redirect_url?: string;
}
