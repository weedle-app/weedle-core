import { BaseSerializer } from '../../../common/base-classes/base-serializer';

export class AuthSerializer extends BaseSerializer {
  authId: string;
  active: boolean;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
