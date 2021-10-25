import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({ example: '230300' })
  @IsString()
  public verification_code: string;
}
