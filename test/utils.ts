import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import mikroOrmTestConfig from '../src/mikro-orm-test.config';
import * as dotenv from 'dotenv';

dotenv.config();

export class SingletonTestContainers {
  private initialized = false;
  private static instance: SingletonTestContainers | null = null;
  public postgresContainer: StartedPostgreSqlContainer | null = null;
  public config: MikroOrmModuleOptions | null = null;

  private constructor() {}

  /**
   * Initializes the singleton, starting the PostgreSQL container and ORM setup.
   */
  public async init(): Promise<void> {
    if (this.initialized) {
      return; // Prevent multiple initializations
    }

    const dbPort = Number(process.env.DB_PORT);
    if (isNaN(dbPort)) {
      throw new Error(
        'DB_PORT must be a valid number in environment variables.',
      );
    }

    this.postgresContainer = await new PostgreSqlContainer()
      .withExposedPorts(dbPort)
      .start();
    const url = this.postgresContainer.getConnectionUri();
    this.config = await mikroOrmTestConfig(url);
    const orm = await MikroORM.init(this.config);
    await orm.getMigrator().up();

    this.initialized = true;
  }

  /**
   * Cleans up resources like the PostgreSQL container.
   */
  public async shutdown(): Promise<void> {
    if (this.postgresContainer) {
      await this.postgresContainer.stop({ remove: true, removeVolumes: true });
      this.postgresContainer = null;
    }
    this.initialized = false;
  }

  /**
   * Returns the singleton instance, creating it if necessary.
   */
  public static getInstance(): SingletonTestContainers {
    if (!SingletonTestContainers.instance) {
      SingletonTestContainers.instance = new SingletonTestContainers();
    }
    return SingletonTestContainers.instance;
  }
}
