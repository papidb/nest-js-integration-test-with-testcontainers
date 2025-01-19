// all the modules you need for test

import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import mikroOrmTestConfig from '../src/mikro-orm-test.config';

import * as dotenv from 'dotenv';
import { Todo } from '../src/todo/todo.entity';
dotenv.config();

export const mikroOrmModule = MikroOrmModule.forFeature({
  entities: [Todo],
});

let postgresContainer: StartedPostgreSqlContainer;
let config: MikroOrmModuleOptions;

export const setupTestDatabase = async () => {
  if (postgresContainer && config) {
    return {
      config,
      postgresContainer,
    };
  }
  postgresContainer = await new PostgreSqlContainer()
    .withExposedPorts(Number(process.env.DB_PORT))
    .start();
  const url = postgresContainer.getConnectionUri();
  config = await mikroOrmTestConfig(url);
  const orm = await MikroORM.init(config);
  await orm.getMigrator().up();
  return { config, postgresContainer };
};
