// src/lib/session.ts
import jwt from 'jsonwebtoken';

export interface UserSession {
  userId: string;
  email: string;
  role: 'ADMIN' | 'OWNER' | 'EMPLOYEE';
}

export function verifyToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserSession;
    return decoded;
  } catch { // Variável de erro removida
    return null;
  }
}