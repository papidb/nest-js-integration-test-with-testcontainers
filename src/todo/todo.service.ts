import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepo: TodoRepository,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepo.findAll();
  }

  async findOne(id: string): Promise<Todo | null> {
    return this.todoRepo.findOne({ id });
  }

  async create(id: string, title: string): Promise<Todo> {
    const todo = this.todoRepo.create({ id, title });
    await this.em.fork().persistAndFlush(todo);
    return todo;
  }

  async update(id: string, completed: boolean): Promise<Todo | null> {
    const todo = await this.todoRepo.findOne({ id });
    if (!todo) return null;
    todo.completed = completed;
    await this.em.fork().persistAndFlush(todo);
    return todo;
  }

  async delete(id: string): Promise<boolean> {
    const todo = await this.todoRepo.findOne({ id });
    if (!todo) return false;
    await this.em.fork().removeAndFlush(todo);
    return true;
  }
}
