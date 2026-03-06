// lib/auth.ts
import prisma from '@/prisma/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function getCurrentUser() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, name: true, phone: true },
    });
  } catch {
    return null;
  }
}