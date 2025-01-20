import { Injectable } from '@nestjs/common';

import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheConfig, Config } from './common/configs/config.interface';

@Injectable()
export class AppService {
  static buildRedisStore(url: string) {
    const store = redisStore({
      url,
    });
    return {
      store: () => store,
    };
  }

  static readonly RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (config: ConfigService<Config>) =>
      AppService.buildRedisStore(config.get<CacheConfig>('cache').redisUrl),
    inject: [ConfigService],
  };
  getHello(): string {
    return 'Hello World!';
  }
}
