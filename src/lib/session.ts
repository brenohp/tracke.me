// src/lib/session.ts
import jwt from 'jsonwebtoken';

export interface UserSession {
  userId: string;
  businessId: string; // <-- CAMPO ADICIONADO
  email: string;
  role: 'ADMIN' | 'OWNER' | 'EMPLOYEE';
}

export function verifyToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserSession;
    return decoded;
  } catch {
    return null;
  }
}