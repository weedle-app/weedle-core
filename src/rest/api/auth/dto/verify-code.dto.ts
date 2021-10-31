import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({ example: 'name@example.com' })
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({ example: '230300' })
  @IsString()
  public verification_code: string;
}
