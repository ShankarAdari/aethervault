import { NextResponse } from 'next/server';
import { serverUserStore, ServerUser } from '@/lib/server/userStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const cleanUsername = username?.trim().toLowerCase();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanUsername) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required for registration' },
        { status: 400 }
      );
    }

    if (!password || password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    // 1. Strict duplicate username check
    if (serverUserStore.has(cleanUsername)) {
      return NextResponse.json(
        { 
          success: false, 
          code: 'USERNAME_TAKEN',
          error: `Username "${username.trim()}" is already registered. Please choose another username or log in.` 
        },
        { status: 409 }
      );
    }

    // 2. Strict duplicate email check (One account per email rule)
    for (const existing of Array.from(serverUserStore.values())) {
      if (existing.email && existing.email.toLowerCase() === cleanEmail) {
        return NextResponse.json(
          {
            success: false,
            code: 'EMAIL_TAKEN',
            error: `The email address "${email.trim()}" is already registered to an existing account. Multiple accounts with the same email are strictly prohibited.`,
          },
          { status: 409 }
        );
      }
    }

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newUser: ServerUser = {
      id: userId,
      username: username.trim(),
      email: cleanEmail,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };

    serverUserStore.set(cleanUsername, newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token: 'jwt_vault_token_' + newUser.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Registration failure' },
      { status: 500 }
    );
  }
}
