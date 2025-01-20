import { Injectable } from '@nestjs/common';

import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheConfig, Config } from './common/configs/config.interface';

@Injectable()
export class AppService {
  static readonly RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (config: ConfigService<Config>) => {
      const store = await redisStore({
        url: config.get<CacheConfig>('cache').redisUrl,
      });
      return {
        store: () => store,
      };
    },
    inject: [ConfigService],
  };
  getHello(): string {
    return 'Hello World!';
  }
}
