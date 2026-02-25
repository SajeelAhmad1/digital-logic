// app/(user)/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { COURSES } from '@/lib/courses';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  return <DashboardClient user={user} courses={COURSES} />;
}