import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { mikroOrmModule, setupTestDatabase } from '../../test/utils';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  let config: MikroOrmModuleOptions;

  beforeAll(async () => {
    const setup = await setupTestDatabase();
    config = setup.config;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(config), mikroOrmModule],
      providers: [TodoService, TodoRepository],
      controllers: [TodoController],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
