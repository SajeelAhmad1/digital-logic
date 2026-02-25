// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/adminClient';
import prisma from '@/prisma/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  // Remove from Supabase Auth first
  if (user.supabaseUid) {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(user.supabaseUid);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  // Remove from Prisma
  await prisma.user.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}