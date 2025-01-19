import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { randomUUID } from 'crypto';
import { setupTestDatabase } from '../../test/utils';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let orm: MikroORM;
  let config: MikroOrmModuleOptions;
  let em: EntityManager;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    const setup = await setupTestDatabase();
    config = setup.config;
    postgresContainer = setup.postgresContainer;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(config),
        MikroOrmModule.forFeature({
          entities: [Todo],
        }),
      ],
      providers: [TodoService, TodoRepository],
    }).compile();

    service = module.get<TodoService>(TodoService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
  });

  beforeEach(async () => {
    // Clear the database before each test
    await em.nativeDelete(Todo, {});
  });

  afterAll(async () => {
    await orm.close(true);
    await postgresContainer.stop({ remove: true, removeVolumes: true });
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
