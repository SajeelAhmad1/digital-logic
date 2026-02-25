'use client';

import React, { useContext, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Users from './Users';
import { AppContext } from '@/utils/context';

function AdminPanel() {
  React.useEffect(() => {
    document.title = 'Admin Panel';
  }, []);
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const {
    context: { user },
  } = useContext(AppContext);

  if (!user?.isAdmin) {
    return <span>Not allowed</span>;
  }

  if (page === 'users') {
    return <Users />;
  }

  return <Users />;
}

export default AdminPanel;
