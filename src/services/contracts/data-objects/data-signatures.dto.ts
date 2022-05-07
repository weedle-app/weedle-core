import { Expose } from 'class-transformer';
import { BaseDTO } from '../../../common/base-classes/base-dto';

export class NFTMintSignaturesDTO extends BaseDTO {
  @Expose()
  hash: string;
  @Expose()
  signature: string;
}
