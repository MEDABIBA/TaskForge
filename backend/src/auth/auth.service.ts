import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import RegisterDto from './dto/register.dto.js';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import LoginDto from './dto/login.dto.js';
import createTokens from '../helpers/tokens.js';

const ROUNDS = 4;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register({ email, name, password }: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    let hash: string;
    if (existing) {
      throw new ConflictException('User already exist');
    }
    try {
      hash = await bcrypt.hash(password, ROUNDS);
    } catch {
      throw new InternalServerErrorException('Failed to process password');
    }
    const user = await this.prisma.user.create({
      data: { email, name, password: hash },
    });
    const { accessToken, refreshToken } = createTokens(user);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      },
    });
    return {
      res: {
        accessToken: accessToken,
        user: { id: user.id, email: user.email, name: user.name },
      },
      refreshToken,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect password');
    }
    const { accessToken, refreshToken } = createTokens(user);
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      },
    });
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!record || record.revoked || record.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }
    const { accessToken } = createTokens(record.user);
    return { accessToken };
  }

  async logout(token: string) {
    if (!token) return;
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }
}
