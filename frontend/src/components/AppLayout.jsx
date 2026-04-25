import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F5F3EE',
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: '32px 40px',
    overflowX: 'hidden',
  },
};

export default function AppLayout() {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
