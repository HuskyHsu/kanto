import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import PWAInstallButton from '@/components/PWAInstallButton';
import { ShareButton } from '@/components/ui/share-button';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div
      className='min-h-screen flex flex-col'
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/background.png)`,
      }}
    >
      {/* Floating action bar: fixed on all screens so it is always accessible regardless of scroll position */}
      <div className='fixed top-3 right-4 sm:right-6 md:top-4 md:right-8 z-40 flex items-center gap-1.5 sm:gap-2'>
        <ShareButton />
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
