import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { mikroOrmModule, setupTestDatabase } from '../../test/utils';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  let config: MikroOrmModuleOptions;

  beforeAll(async () => {
    const setup = await setupTestDatabase();
    config = setup.config;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(config), mikroOrmModule],
      providers: [TodoService, TodoRepository],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
