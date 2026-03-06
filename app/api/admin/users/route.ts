import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';

// GET — list all users
export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
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

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}

// POST — create a user
export async function POST(req: NextRequest) {
  try {
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

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken.' },
        { status: 409 }
      );
    }

    // Hash password
    const pwHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        phone: phone || '',
        pwHash,
      },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }
}