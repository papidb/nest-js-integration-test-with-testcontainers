import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepo: TodoRepository,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async setTodoToCache(todo: Todo, ttl?: 60000): Promise<Todo> {
    return this.cacheManager.set(`todo:${todo.id}`, todo, ttl);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepo.findAll();
  }

  async findOne(id: string): Promise<Todo | null> {
    const todo = await this.cacheManager.get<Todo>(`todo:${id}`);
    if (todo) {
      return todo;
    }
    return this.todoRepo.findOne({ id });
  }

  async create(id: string, title: string): Promise<Todo> {
    const todo = this.todoRepo.create({ id, title });
    await this.em.fork().persistAndFlush(todo);
    await this.setTodoToCache(todo);
    return todo;
  }

  async update(id: string, completed: boolean): Promise<Todo | null> {
    const todo = await this.todoRepo.findOne({ id });
    if (!todo) return null;
    todo.completed = completed;
    await this.em.fork().persistAndFlush(todo);
    await this.setTodoToCache(todo);
    return todo;
  }

  async delete(id: string): Promise<boolean> {
    const todo = await this.todoRepo.findOne({ id });
    if (!todo) return false;
    await this.em.fork().removeAndFlush(todo);
    await this.cacheManager.del(`todo:${todo.id}`);
    return true;
  }
}
