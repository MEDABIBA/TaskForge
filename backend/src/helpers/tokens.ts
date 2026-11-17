import { UserModel } from '../generated/models/User.js';
import jwt from 'jsonwebtoken';

export default function createTokens(user: UserModel): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_JWT!, {
    expiresIn: '15m',
  });
  const refreshToken = crypto.randomUUID();
  return { accessToken, refreshToken };
}
