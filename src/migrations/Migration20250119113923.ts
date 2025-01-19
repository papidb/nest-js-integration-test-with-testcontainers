import { Migration } from '@mikro-orm/migrations';

export class Migration20250119113923 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "todo" ("id" uuid not null, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "title" varchar(255) not null, "completed" boolean not null default false, constraint "todo_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "todo" cascade;`);
  }

}
