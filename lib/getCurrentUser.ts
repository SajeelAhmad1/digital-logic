// lib/getCurrentUser.ts
import { createClient } from '@/lib/supabase/server';
import prisma from '@/prisma/prisma';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
    select: { id: true, name: true, username: true },
  });

  return dbUser;
}