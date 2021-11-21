import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ChangePassword {
  @ApiProperty({ example: '3820' })
  @IsString()
  @IsOptional()
  @Transform((s) => String(s.value).trim())
  public readonly current_password: string;

  @ApiProperty({ example: '3820' })
  @IsString()
  @IsOptional()
  @Transform((s) => String(s.value).trim())
  public readonly password: string;
}
