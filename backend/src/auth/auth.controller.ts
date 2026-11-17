import {
  Body,
  Controller,
  Cookies,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import RegisterDto from './dto/register.dto.js';
import LoginDto from './dto/login.dto.js';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { res, refreshToken } = await this.authService.register(registerDto);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/api/auth',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res;
  }
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, user };
  }

  @Post('refresh')
  async refresh(@Cookies('refreshToken') refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
  }
}
