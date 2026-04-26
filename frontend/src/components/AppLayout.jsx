import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useViewport from './shared/useViewport';

export default function AppLayout() {
  const { isMobile } = useViewport();
  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
      background: '#F5F3EE',
    }}>
      <Sidebar isMobile={isMobile} />
      <main style={{
        flex: 1,
        minWidth: 0,
        padding: isMobile ? '16px 14px' : '32px 40px',
        overflowX: 'hidden',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
