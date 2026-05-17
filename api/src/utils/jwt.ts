import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';
import { UserRole } from '../models/User';

export type JwtPayload = {
  sub: string;
  role: UserRole;
};

export function signToken(payload: JwtPayload): string {
  const expiresIn = env.jwtExpiresIn as SignOptions['expiresIn'];
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
