import { NextResponse } from 'next/server';
import { serverUserStore, ServerUser } from '@/lib/server/userStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const cleanInput = username?.trim().toLowerCase();
    if (!cleanInput || !password) {
      return NextResponse.json(
        { success: false, error: 'Username or email, and password are required' },
        { status: 400 }
      );
    }

    // Lookup user by username OR email
    let user: ServerUser | undefined;
    if (cleanInput.includes('@')) {
      for (const u of Array.from(serverUserStore.values())) {
        if (u.email && u.email.toLowerCase() === cleanInput) {
          user = u;
          break;
        }
      }
    } else {
      user = serverUserStore.get(cleanInput);
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: 'USER_NOT_FOUND',
          error: `No account found for "${username.trim()}". You are not registered. Please register first to set up your personal database.`,
        },
        { status: 404 }
      );
    }

    // Check password
    if (user.passwordHash !== password) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_CREDENTIALS',
          error: 'Incorrect password entered. Please verify your credentials and try again.',
        },
        { status: 401 }
      );
    }

    // Valid authenticated user
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: 'jwt_vault_token_' + user.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server authentication failure' },
      { status: 500 }
    );
  }
}
