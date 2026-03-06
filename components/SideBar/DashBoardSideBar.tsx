'use client';
// components/dashboard/DashboardSidebar.tsx

interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

function SidebarItem({ icon, label, active }: SidebarItemProps) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px',
        borderLeft: active ? '3px solid #5b4fcf' : '3px solid transparent',
        background: active ? '#f0effe' : 'transparent',
        color: active ? '#5b4fcf' : '#555',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </div>
  );
}

export default function DashboardSidebar() {
  return (
    <aside
      className="dash-sidebar"
      style={{
        width: 220,
        background: '#fff',
        borderRight: '1px solid #e5e3dc',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      <SidebarItem icon="⊞" label="Dashboard" active />
    </aside>
  );
}