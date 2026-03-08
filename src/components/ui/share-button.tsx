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
        className={`flex items-center justify-center gap-2 p-2 h-10 min-w-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer group ${className}`}
        title='Share Page'
        {...props}
      >
        <Link size={20} className='text-rose-500 group-hover:scale-110 transition-transform' />
        <span className='text-xs font-bold font-mono w-10 text-center select-none uppercase hidden md:inline-block'>
          SHARE
        </span>
      </button>
    );
  },
);

ShareButton.displayName = 'ShareButton';

export { ShareButton };
export type { ShareButtonProps };
