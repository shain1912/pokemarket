import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthModal } from '../common/AuthModal';
import { CartDrawer } from '../common/CartDrawer';
import { Toast } from '../common/Toast';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  readonly children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen">
      <Header />
      <main className="w-full pt-48 bg-background min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <AuthModal />
      <Toast />
    </div>
  );
}
