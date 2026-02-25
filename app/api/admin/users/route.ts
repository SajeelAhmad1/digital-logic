// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { createAdminClient, usernameToInternalEmail } from '@/lib/supabase/adminClient';
import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';

// GET — list all users
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      username: true,
      phone: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

// POST — create a user
export async function POST(req: NextRequest) {
  try{
    if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { name, username, phone, password } = await req.json();

  if (!name || !username || !password) {
    return NextResponse.json(
      { error: 'Name, username, and password are required.' },
      { status: 400 }
    );
  }

  const pwHash = await bcrypt.hash(password, 12);

  // Check username is unique in our DB before even hitting Supabase
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json(
      { error: 'Username is already taken.' },
      { status: 409 }
    );
  }

  const internalEmail = usernameToInternalEmail(username);
  const supabase = createAdminClient();

  // Create in Supabase Auth — email_confirm: true skips any verification email
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: { name, username, phone },
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Create the Prisma record
  const user = await prisma.user.create({
    data: {
      email: internalEmail,
      name,
      username,
      phone: phone || '',
      pwHash,
      supabaseUid: authData.user.id,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
  }catch(error:any){
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}