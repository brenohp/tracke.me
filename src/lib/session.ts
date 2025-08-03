// Caminho do arquivo: src/lib/session.ts
import { jwtVerify, JWTPayload } from 'jose'; // Importamos JWTPayload para estender

// Nossa interface agora estende a interface padrão do 'jose'
export interface UserSession extends JWTPayload {
  userId: string;
  businessId: string;
  email: string;
  role: 'ADMIN' | 'OWNER' | 'EMPLOYEE';
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  if (!token) {
    return null;
  }
  
  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
    
    // AVISAMOS ao jwtVerify que esperamos um payload do tipo UserSession
    const { payload } = await jwtVerify<UserSession>(token, secretKey);
    
    // Agora o 'payload' já tem o tipo correto, sem precisar de conversão forçada
    return payload;
  } catch (error) {
    console.error("Falha na verificação do JWT com 'jose':", error);
    return null;
  }
}