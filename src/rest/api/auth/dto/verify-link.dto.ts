import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class VerifyLinkDto {
  @ApiProperty({ example: 'name@example.com' })
  @Transform((s) => String(s.value).trim().toLowerCase())
  @IsString()
  public readonly email: string;

  @ApiProperty({ example: 'zoxoxowooe0e0e' })
  @IsString()
  public readonly token: string;
}
