import { usePokemonContext } from '@/contexts/PokemonContext';
import {
  canShowInstallPrompt,
  isPWAInstalled,
  isPWASupported,
  PWAImageCache,
  showInstallPrompt,
} from '@/utils/pwaUtils';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PWAInstallButtonProps {
  preloadPokemonImages?: boolean;
}

export default function PWAInstallButton({ preloadPokemonImages = true }: PWAInstallButtonProps) {
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
      className='flex items-center justify-center gap-2 p-2 h-10 min-w-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed'
      title={
        isPreloading
          ? 'Preloading Pokemon images...'
          : isInstalling
            ? 'Installing...'
            : 'Install to Desktop'
      }
    >
      {isInstalling || isPreloading ? (
        <div className='w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin' />
      ) : (
        <>
          <Download
            size={20}
            className='text-green-500 group-hover:scale-110 transition-transform'
          />
          <span className='text-xs font-bold font-mono w-6 text-center select-none uppercase hidden md:inline-block'>
            APP
          </span>
        </>
      )}
    </button>
  );
}
