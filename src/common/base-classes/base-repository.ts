import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

// Base repository will be used for all properties or functionality that should be shared by all repos e.g. caching
export default class BaseRepository<T> extends Repository<T> {
  transformEntity<K>(model: T, dataObject: any): K {
    return plainToInstance(dataObject, model, {
      excludeExtraneousValues: true,
    });
  }
}
