import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default async (url: string) => {
  return defineConfig({
    clientUrl: global.clientUrl || url,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: true,
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,
    // @ts-expect-error nestjs adapter option
    registerRequestContext: false,
    extensions: [Migrator, EntityGenerator, SeedManager],
    logger: () => {},
    allowGlobalContext: true,
  });
};
