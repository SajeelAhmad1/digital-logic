import type { ReactNode } from 'react';
import DashboardNav from '@/components/Header/DashboardNav';
import DashboardSidebar from '@/components/SideBar/DashBoardSideBar';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';

const RESPONSIVE_STYLES = `
  @media (max-width: 768px) {
    .dash-sidebar       { display: none !important; }
    .dash-layout        { flex-direction: column !important; }
    .dash-main          { padding: 24px 16px !important; max-width: 100% !important; }
    .dash-course-grid   { grid-template-columns: 1fr !important; }
    .dash-nav           { padding: 0 16px !important; }
    .dash-ip-footer     { flex-direction: column !important; align-items: stretch !important; }
    .dash-ip-title      { font-size: 18px !important; }
    .dash-page-title    { font-size: 22px !important; }
    .dash-user-name     { display: none !important; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .dash-main        { padding: 32px 28px !important; }
    .dash-course-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important; }
  }
`;

interface Props {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f2', fontFamily: "'Georgia', serif" }}>
      <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_STYLES }} />
      <DashboardNav user={user} />
      <div className="dash-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        <DashboardSidebar />
        <main className="dash-main" style={{ flex: 1, padding: '40px 48px', maxWidth: 900 }}>
          {children}
        </main>
      </div>
    </div>
  );
}