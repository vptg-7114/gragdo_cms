import { SignJWT, jwtVerify } from 'jose';
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
 * Refresh an access token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    return data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}