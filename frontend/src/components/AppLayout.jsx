import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import { colors } from '../theme';
import useViewport from './shared/useViewport';

export default function AppLayout() {
  const { isMobile } = useViewport();

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bgWhite,
      display: 'flex',
      flexDirection: 'column',
      color: colors.textPrimary,
    }}>
      <TopNavbar />

      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: 1280,
        margin: '0 auto',
        padding: isMobile ? '24px 16px' : '40px 32px',
      }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
