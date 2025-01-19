import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { SingletonTestContainers } from '../../test/utils';
import { TodoController } from './todo.controller';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';
import { MikroORM } from '@mikro-orm/postgresql';

describe('TodoController', () => {
  let controller: TodoController;
  let orm: MikroORM;
  let config: MikroOrmModuleOptions;
  const testContainers = SingletonTestContainers.getInstance();

  beforeAll(async () => {
    await testContainers.init();
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
      controllers: [TodoController],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterAll(async () => {
    await orm.close(true);
    await testContainers.shutdown();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
