import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../common/database/base.entity';
import { TodoRepository } from './todo.repository';

@Entity({ repository: () => TodoRepository })
export class Todo extends BaseEntity {
  @Property()
  title!: string;

  @Property({ default: false })
  completed!: boolean;
}
