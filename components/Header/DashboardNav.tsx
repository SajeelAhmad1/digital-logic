// components/dashboard/DashboardNav.tsx
'use client';

import { DashboardUser } from "@/types/dashboard";

interface DashboardNavProps {
  user: DashboardUser;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav
      className="dash-nav"
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e3dc',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px', color: '#1a1a1a' }}>
        Digital Logic
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          className="dash-user-name"
          style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}
        >
          {user.name}
        </span>
        <div
          title="Logout"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#5b4fcf', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
          // onClick={() => logout()}
        >
          {initials}
        </div>
      </div>
    </nav>
  );
}