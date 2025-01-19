import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<
  T extends BaseEntity,
> extends EntityRepository<T> {}
