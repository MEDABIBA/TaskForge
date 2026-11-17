import { Module } from '@nestjs/common';
import UsersModule from './users/users.module.js';
import TasksModule from './tasks/tasks.module.js';
import AuthModule from './auth/auth.module.js';

@Module({
  imports: [UsersModule, TasksModule, AuthModule],
})
export class AppModule {}
