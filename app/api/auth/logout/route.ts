import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/actions/auth';

export async function POST() {
  try {
    const result = await logout();

    return NextResponse.json({
      success: result.success
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}