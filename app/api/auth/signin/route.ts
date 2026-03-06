// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const match = await bcrypt.compare(password, user.pwHash ?? '');
  if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  // Generate JWT
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  const response = NextResponse.json({
    user: { id: user.id, username: user.username, name: user.name },
  });

  // Set HTTP-only cookie
  response.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}