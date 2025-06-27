import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { config } from '@/lib/config';
import { UserRole } from '@/lib/types';

// Convert string to Uint8Array for jose
const textEncoder = new TextEncoder();

/**
 * Generate a JWT token for a user
 */
export async function generateToken(payload: any): Promise<string> {
  const secret = textEncoder.encode(config.jwt.secret);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt.expiresIn)
    .sign(secret);
  
  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const secret = textEncoder.encode(config.jwt.secret);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set the authentication token in cookies
 */
export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

/**
 * Get the authentication token from cookies
 */
export function getAuthCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get('auth-token')?.value;
}

/**
 * Clear the authentication token from cookies
 */
export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
}

/**
 * Get the current user ID from the authentication token
 */
export async function getCurrentUserId(): Promise<string | null> {
  const token = getAuthCookie();
  if (!token) return null;
  
  const payload = await verifyToken(token);
  return payload?.id || null;
}

/**
 * Check if the current user has the required role
 */
export async function checkUserRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  const token = getAuthCookie();
  if (!token) return false;
  
  const payload = await verifyToken(token);
  if (!payload) return false;
  
  const userRole = payload.role;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}