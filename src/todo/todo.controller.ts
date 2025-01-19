import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Todo | null> {
    return this.todoService.findOne(id);
  }

  @Post()
  create(@Body('title') title: string): Promise<Todo> {
    return this.todoService.create(title);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body('completed') completed: boolean,
  ): Promise<Todo | null> {
    return this.todoService.update(id, completed);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.todoService.delete(id);
  }
}
