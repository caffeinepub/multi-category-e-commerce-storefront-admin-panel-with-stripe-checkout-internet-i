import { Outlet } from '@tanstack/react-router';
import HeaderNav from './HeaderNav';
import Footer from './Footer';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';

export default function SiteLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
      <ProfileSetupDialog />
    </div>
  );
}
