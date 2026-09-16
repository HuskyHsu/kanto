import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PreEvoMoveIconProps {
  pid: number;
  level: number;
  name?: { zh: string; ja?: string; en?: string } | string;
  isEarlier?: boolean;
  isPreEvoOnly?: boolean;
  currentLevel?: number;
  className?: string;
  disableLink?: boolean;
  size?: 'sm' | 'md';
}

export default function PreEvoMoveIcon({
  pid,
  level,
  name,
  isEarlier = false,
  isPreEvoOnly = false,
  currentLevel,
  className,
  disableLink = false,
  size = 'sm',
}: PreEvoMoveIconProps) {
  const { displayLanguage } = useLanguage();

  const getLocalizedName = (n?: { zh: string; ja?: string; en?: string } | string) => {
    if (!n) return '';
    if (typeof n === 'string') return n;
    if (displayLanguage === 'ja' && n.ja) return n.ja;
    if (displayLanguage === 'en' && n.en) return n.en;
    return n.zh;
  };

  const localizedName = getLocalizedName(name);

  // Determine level text
  let levelText = '';
  if (level > 1) {
    levelText = `Lv.${level}`;
  } else if (level === 1) {
    levelText = 'Lv.1';
  } else if (level === 0) {
    levelText = 'Evolve';
  } else {
    levelText = `Lv.${Math.abs(level)}`;
  }

  // Construct tooltip title
  let tooltipTitle = localizedName ? `${localizedName} ${levelText}` : levelText;
  if (isEarlier && currentLevel && currentLevel > 1 && level > 0) {
    const diff = currentLevel - level;
    tooltipTitle = localizedName
      ? `${localizedName} 比目前形態早 ${diff} 等學會 (${levelText})`
      : `比目前形態早 ${diff} 等學會 (${levelText})`;
  } else if (isPreEvoOnly) {
    tooltipTitle = localizedName
      ? `${localizedName} 僅進化前可學會 (${levelText})`
      : `僅進化前可學會 (${levelText})`;
  }

  const isSm = size === 'sm';

  const content = (
    <div
      className={cn(
        'relative flex items-center justify-center select-none shrink-0',
        isSm ? 'w-8 h-8' : 'w-10 h-10',
        className,
      )}
      title={tooltipTitle}
    >
      {/* 8-Bit Pixel Animated Sprite */}
      <div
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/pmIcon8Bit/${pid}.png)`,
          transform: isSm ? 'scale(0.5)' : 'scale(0.625)',
        }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 switchingLeftRight filter drop-shadow-sm pointer-events-none'
      />

      {/* Lv Overlay on Lower Part of Icon */}
      <span
        className={cn(
          'absolute left-1/2 -translate-x-1/2 z-10 leading-none font-sans font-black tracking-tight whitespace-nowrap pointer-events-none select-none',
          isSm ? '-bottom-0.5 text-[9px]' : 'bottom-0 text-[10px]',
          isEarlier
            ? 'text-emerald-700 font-extrabold'
            : isPreEvoOnly
              ? 'text-amber-800 font-extrabold'
              : 'text-slate-800',
        )}
        style={{
          textShadow:
            '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 1px 2px rgba(255,255,255,0.95), 0 0 2px #fff',
        }}
      >
        {levelText}
      </span>
    </div>
  );

  if (disableLink) {
    return content;
  }

  return (
    <Link
      to={`/pokemon/${pid}`}
      onClick={(e) => e.stopPropagation()}
      className='inline-flex items-center justify-center rounded transition-transform duration-200 hover:scale-110 active:scale-95'
      title={tooltipTitle}
    >
      {content}
    </Link>
  );
}
