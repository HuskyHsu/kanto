import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import PWAInstallButton from '@/components/PWAInstallButton';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div
      className='min-h-screen flex flex-col'
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/background.png)`,
      }}
    >
      <div className='fixed bottom-4 right-4 md:top-4 md:bottom-auto md:right-5 z-50 flex flex-col md:flex-row gap-2'>
        <PWAInstallButton />
        <LanguageToggle />
      </div>
      {/* <Navigation /> */}
      <main className='container mx-auto p-4 md:p-8 max-w-6xl flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
