import { EntityRepository } from '@mikro-orm/postgresql';
import { Todo } from './todo.entity';

export class TodoRepository extends EntityRepository<Todo> {}
