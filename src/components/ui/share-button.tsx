import { cn } from '@/lib/utils';
import { Link } from 'lucide-react';
import React from 'react';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ title = '', text = '', url = '', className = '', ...props }, ref) => {
    const handleShare = async () => {
      // Use current URL if no URL is provided
      const shareUrl = url || window.location.href;
      const fullText = text || title || document.title;

      // Check if navigator.share is supported
      if (navigator.share) {
        try {
          await navigator.share({
            title: title || document.title,
            text: `${fullText}\n`,
            url: shareUrl,
          });
        } catch (error) {
          // User cancelled the share or an error occurred
          console.log('Error sharing:', error);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('URL copied to clipboard!');
        } catch (error) {
          console.log('Error copying to clipboard:', error);
          // Ultimate fallback: show alert with URL
          alert(`Share this URL: ${shareUrl}`);
        }
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleShare}
        type='button'
        className={cn(
          'w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all cursor-pointer group flex-shrink-0',
          className,
        )}
        title='Share Page'
        aria-label='Share Page'
        {...props}
      >
        <Link size={18} className='text-rose-500 group-hover:scale-110 transition-transform' />
      </button>
    );
  },
);

ShareButton.displayName = 'ShareButton';

export { ShareButton };
export type { ShareButtonProps };
