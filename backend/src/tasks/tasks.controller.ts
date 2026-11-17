import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import type { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { RequestDto } from '../dto/request.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: RequestDto) {
    return this.tasksService.findAll(req.userId);
  }
  @UseGuards(AuthGuard)
  @Post()
  createOne(@Req() req: RequestDto, @Body() body: CreateTaskDto) {
    return this.tasksService.createOne(req.userId, body);
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Req() req: RequestDto,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(req.userId, Number(id), body);
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Req() req: RequestDto, @Param('id') id: string) {
    return this.tasksService.remove(req.userId, Number(id));
  }
}
