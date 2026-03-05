import { Footer } from '@/components/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div
      className='min-h-screen flex flex-col'
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/background.png)`,
      }}
    >
      <LanguageToggle />
      {/* <Navigation /> */}
      <main className='container mx-auto p-4 md:p-8 max-w-6xl flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
