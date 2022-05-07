import { Exclude, Expose } from 'class-transformer';
import { BaseDTO } from '../../../common/base-classes/base-dto';
import { AuthEntity } from '../entities/auth.entity';

export class AuthDTO extends BaseDTO {
  constructor(partial: Partial<AuthEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  accountVerified: boolean;
  @Expose()
  deleted: boolean;
  @Expose()
  created_at: Date;
  @Expose()
  updated_at: Date;
}
