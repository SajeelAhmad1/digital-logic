// app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/adminAuth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}