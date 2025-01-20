import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Cache, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { SingletonTestContainers } from '../../test/utils';
import { AppService } from '../app.service';
import config from '../common/configs/config';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let orm: MikroORM;
  let em: EntityManager;
  let cacheManager: Cache;
  const testContainers = SingletonTestContainers.getInstance();

  beforeAll(async () => {
    jest.setTimeout(60000);
    await testContainers.init();
  });

  beforeEach(async () => {
    const redisOptions = AppService.RedisOptions;
    redisOptions.useFactory = async () =>
      AppService.buildRedisStore(testContainers.redisUrl);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        MikroOrmModule.forRoot(testContainers.config),
        MikroOrmModule.forFeature({
          entities: [Todo],
        }),
        CacheModule.registerAsync(redisOptions),
      ],
      providers: [TodoService, TodoRepository],
    }).compile();

    service = module.get<TodoService>(TodoService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    cacheManager = module.get<Cache>(Cache);
  });

  beforeEach(async () => {
    // Clear the database before each test
    await em.nativeDelete(Todo, {});
  });

  afterAll(async () => {
    await orm.close(true);
    await testContainers.shutdown();
  });

  it('should create a new todo', async () => {
    const todo = await service.create(randomUUID(), 'Test Todo');
    expect(todo).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Test Todo',
        completed: false,
      }),
    );

    const todos = await em.find(Todo, {});
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Test Todo');

    // created todo should be in the cache
    const todoFromCache = await cacheManager.get<Todo>(`todo:${todos[0].id}`);
    expect(todoFromCache.id).toMatch(todos[0].id);
  });

  it('should retrieve all todos', async () => {
    await em.insertMany(Todo, [
      { id: randomUUID(), title: 'Todo 1', completed: false },
      { id: randomUUID(), title: 'Todo 2', completed: true },
    ]);

    const todos = await service.findAll();
    expect(todos).toHaveLength(2);
    expect(todos[0].title).toBe('Todo 1');
    expect(todos[1].title).toBe('Todo 2');
  });

  it('should update a todo', async () => {
    const todo = em.create(Todo, {
      title: 'Update Test',
      completed: false,
      id: randomUUID(),
    });
    await em.persistAndFlush(todo);

    const updatedTodo = await service.update(todo.id, true);
    expect(updatedTodo).toEqual(
      expect.objectContaining({
        id: todo.id,
        title: 'Update Test',
        completed: true,
      }),
    );

    const savedTodo = await em.findOneOrFail(Todo, { id: todo.id });
    expect(savedTodo.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const todo = em.create(Todo, {
      title: 'Delete Test',
      completed: false,
      id: randomUUID(),
    });
    await em.persistAndFlush(todo);

    await service.delete(todo.id);

    const remainingTodos = await em.find(Todo, {});
    expect(remainingTodos).toHaveLength(0);
  });
});
