import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey({ unique: true, type: 'uuid' })
  id!: string;

  @Property({ onUpdate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  updatedAt = new Date();

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt = new Date();
}
