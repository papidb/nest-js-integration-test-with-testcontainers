import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import * as dotenv from 'dotenv';
import mikroOrmTestConfig from '../src/mikro-orm-test.config';

dotenv.config();

export class SingletonTestContainers {
  private initialized = false;
  private static instance: SingletonTestContainers | null = null;
  public postgresContainer: StartedPostgreSqlContainer | null = null;
  public config: MikroOrmModuleOptions | null = null;
  public redisContainer: StartedRedisContainer | null = null;
  public redisUrl: string | null = null;

  private constructor() {}

  public async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.postgresContainer = await new PostgreSqlContainer().start();
    const url = this.postgresContainer.getConnectionUri();
    this.config = await mikroOrmTestConfig(url);
    const orm = await MikroORM.init(this.config);
    await orm.getMigrator().up();

    this.redisContainer = await new RedisContainer(
      'redis:5.0.3-alpine',
    ).start();
    this.redisUrl = this.redisContainer.getConnectionUrl();

    this.initialized = true;
  }

  public async shutdown(): Promise<void> {
    this.postgresContainer = null;
    this.config = null;
    this.redisContainer = null;
    this.redisUrl = null;
    this.initialized = false;
  }

  public static getInstance(): SingletonTestContainers {
    if (!SingletonTestContainers.instance) {
      SingletonTestContainers.instance = new SingletonTestContainers();
    }
    return SingletonTestContainers.instance;
  }
}
