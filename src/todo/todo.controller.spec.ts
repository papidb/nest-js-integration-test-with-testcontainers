import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SingletonTestContainers } from '../../test/utils';
import { AppService } from '../app.service';
import appConfig from '../common/configs/config';
import { TodoController } from './todo.controller';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

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
        ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
        MikroOrmModule.forRoot(config),
        MikroOrmModule.forFeature({
          entities: [Todo],
        }),
        CacheModule.registerAsync(AppService.RedisOptions),
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
