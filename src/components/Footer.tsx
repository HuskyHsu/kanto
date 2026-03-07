import { ReleaseNotesModal } from '@/components/ReleaseNotesModal';
import { useManualReleaseChecker } from '@/hooks/useManualReleaseChecker';
import { ExternalLink, FileText, Github } from 'lucide-react';

export const Footer = () => {
  const { releases, showModal, isLoading, checkRelease, closeModal } = useManualReleaseChecker();

  return (
    <>
      <footer className='mt-16 w-full bg-[#dcf1f1]'>
        {/* Pallet Town Shore (Grass & Sand) */}
        <div className='w-full opacity-90'>
          <div className='h-[3px] bg-[#78c850] w-full'></div>
          <div className='h-[4px] bg-[#f8d878] w-full'></div>
        </div>

        <div className='container mx-auto px-4 py-8 max-w-3xl'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            {/* Left side - App info */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.png`}
                  className='w-6 h-6 opacity-70 mix-blend-multiply'
                  alt='Kanto'
                />
                <span className='text-sm font-medium text-[#115e59]'>Kanto Pokédex</span>
              </div>
              <span className='text-xs text-[#115e59]/60'>© 2026</span>
            </div>

            {/* Center - Links */}
            <div className='flex items-center gap-6 text-sm'>
              <button
                onClick={checkRelease}
                disabled={isLoading}
                className='flex items-center gap-1 text-[#134e4a] hover:text-[#0d9488] transition-colors disabled:opacity-50 cursor-pointer'
              >
                <FileText size={16} />
                {isLoading ? 'Loading...' : 'Release Notes'}
              </button>

              <a
                href='https://github.com/HuskyHsu/kanto'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-[#134e4a] hover:text-[#0d9488] transition-colors'
              >
                <Github size={16} />
                GitHub
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Right side - Additional info */}
            <div className='text-xs text-[#115e59]/60'>Made with ❤️ for Pokémon fans</div>
          </div>
        </div>
      </footer>

      {/* Release Notes Modal */}
      {releases.length > 0 && (
        <ReleaseNotesModal releases={releases} isOpen={showModal} onClose={closeModal} />
      )}
    </>
  );
};
