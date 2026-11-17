import { Controller, Cookies, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './users.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequestDto } from '../dto/request.dto.js';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getUser(@Req() req: RequestDto) {
    return await this.userService.getUser(req.userId);
  }
}
