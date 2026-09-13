import { usePokemonContext } from '@/contexts/PokemonContext';
import {
  canShowInstallPrompt,
  isPWAInstalled,
  isPWASupported,
  PWAImageCache,
  showInstallPrompt,
} from '@/utils/pwaUtils';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PWAInstallButtonProps {
  preloadPokemonImages?: boolean;
  className?: string;
}

export default function PWAInstallButton({
  preloadPokemonImages = true,
  className = '',
}: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const { pokemonList } = usePokemonContext();

  useEffect(() => {
    const updateInstallStatus = () => {
      if (isPWASupported() && !isPWAInstalled()) {
        setCanInstall(canShowInstallPrompt());
      } else {
        setCanInstall(false);
      }
    };

    updateInstallStatus();

    const handleBeforeInstallPrompt = () => {
      updateInstallStatus();
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    setIsInstalling(true);
    try {
      const installed = await showInstallPrompt();
      if (installed) {
        setCanInstall(false);

        if (preloadPokemonImages && pokemonList.length > 0) {
          setIsPreloading(true);
          try {
            const pokemonIds = pokemonList.map((pokemon) => String(pokemon.pid));

            console.log(
              `Starting to preload ${pokemonIds.length} Pokemon images (normal + shiny)...`,
            );
            await PWAImageCache.preloadPokemonImages(pokemonIds);
            console.log('Pokemon images preloaded successfully');
          } catch (preloadError) {
            console.error('Failed to preload Pokemon images:', preloadError);
          } finally {
            setIsPreloading(false);
          }
        }
      }
    } catch (error) {
      console.error('Failed to install app:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show button if PWA is not supported, already installed, or install prompt is not available
  if (!canInstall) {
    return null;
  }

  return (
    <button
      onClick={handleInstallApp}
      disabled={isInstalling}
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0',
        className,
      )}
      title={
        isPreloading
          ? 'Preloading Pokemon images...'
          : isInstalling
            ? 'Installing...'
            : 'Install to Desktop'
      }
      aria-label='Install App'
    >
      {isInstalling || isPreloading ? (
        <div className='w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin' />
      ) : (
        <Download
          size={18}
          className='text-emerald-600 group-hover:scale-110 transition-transform'
        />
      )}
    </button>
  );
}
