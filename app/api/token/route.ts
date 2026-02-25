import prisma from '@/prisma/prisma';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const session = await getServerSession({
    secret: process.env.AUTH_SECRET,
  });
  const { name, email, image } = (session?.user || {}) as any;
  if (email) {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          isEmailVerified: true,
        },
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    const response = NextResponse.json({
      token,
      user,
    });
    return response;
  }
  return NextResponse.json({ message: 'user not found', error: true });
};
