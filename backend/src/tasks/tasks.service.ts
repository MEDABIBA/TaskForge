import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { Priority, Status } from '../generated/enums.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskMaxAggregateOutputType } from '../generated/models/Task.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
    });
    return {
      tasks: tasks.map((t: TaskMaxAggregateOutputType) => ({
        ...t,
        status: t.status?.toLowerCase(),
        priority: t.priority?.toLowerCase(),
      })),
    };
  }

  async createOne(userId: number, body: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        userId,
        title: body.title,
        description: body.description || '',
        status: (body.status?.toUpperCase() as Status) ?? Status.TODO,
        priority: (body.priority?.toUpperCase() as Priority) ?? Priority.MEDIUM,
      },
    });
    return {
      task: {
        ...task,
        status: task.status.toLowerCase(),
        priority: task.priority.toLowerCase(),
      },
    };
  }
  async update(userId: number, taskId: number, body: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.update({
        where: { id: taskId, userId },
        data: {
          title: body?.title,
          description: body?.description,
          status: body.status
            ? (body.status.toUpperCase() as Status)
            : undefined,
          priority: body.priority
            ? (body.priority.toUpperCase() as Priority)
            : undefined,
        },
      });
      return {
        task: {
          ...task,
          status: task.status.toLowerCase(),
          priority: task.priority.toLowerCase(),
        },
      };
    } catch {
      throw new NotFoundException('Task not found');
    }
  }
  async remove(userId: number, taskId: number) {
    try {
      const task = await this.prisma.task.delete({
        where: {
          id: taskId,
          userId,
        },
      });
      return { task };
    } catch {
      throw new NotFoundException('Task not found');
    }
  }
}
