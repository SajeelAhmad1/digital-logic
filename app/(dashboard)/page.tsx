import DashboardClient from '@/components/Dashboard/DashboardClient';
import { COURSES } from '@/lib/courses';

export default async function DashboardPage() {
  return <DashboardClient courses={COURSES} />;
}