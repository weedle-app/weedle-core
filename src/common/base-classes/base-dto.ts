import { Exclude } from 'class-transformer';

export abstract class BaseDTO {
  id?: string;

  @Exclude()
  tableName: string;

  [key: string]: any;
}
