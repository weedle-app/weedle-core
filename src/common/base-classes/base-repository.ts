import { Repository } from 'typeorm';

// Base repository will be used for all properties or functionality that should be shared by all repos e.g. caching
export default class BaseRepository<T> extends Repository<T> {}
