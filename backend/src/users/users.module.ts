import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UserService } from './users.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [PrismaModule],
})
export default class UsersModule {}
