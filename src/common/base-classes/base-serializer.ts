import { Exclude } from 'class-transformer';

export abstract class BaseSerializer {
  id?: string;

  @Exclude()
  tableName: string;

  [key: string]: any;
}
