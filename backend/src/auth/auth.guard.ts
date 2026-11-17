import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string = request.headers.authorization;
    if (!header?.startsWith('Bearer')) {
      throw new UnauthorizedException('');
    }
    const token = header.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.SECRET_JWT!) as {
        userId: number;
      };
      request.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException('');
    }
  }
}
