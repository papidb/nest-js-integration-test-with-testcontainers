import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Todo] })],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
