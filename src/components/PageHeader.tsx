import { Link, useLocation } from 'react-router-dom';

interface PageHeaderProps {
  title?: string;
  className?: string;
}

export function PageHeader({ title, className = '' }: PageHeaderProps) {
  const location = useLocation();

  const displayTitle =
    title ??
    (location.pathname.includes('/locations')
      ? 'Locations'
      : location.pathname.includes('/moves')
        ? 'Move List'
        : 'FireRed & LeafGreen Pokédex');

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <h1 className='flex items-center gap-2 min-w-0 flex-1'>
        <img
          src={`${import.meta.env.BASE_URL}images/logo.png`}
          className='w-12 h-12 md:w-20 md:h-20 flex-shrink-0'
          alt='Pokemon Logo'
        />
        <Link
          to='/'
          className='font-press-start text-xs sm:text-sm md:text-xl tracking-tighter text-slate-700 leading-tight'
        >
          {displayTitle}
        </Link>
      </h1>

      {/* Reservation spacer: aligns header with fixed buttons on the same row, preventing overlap */}
      <div className='w-[130px] sm:w-[140px] flex-shrink-0 h-10' aria-hidden='true' />
    </div>
  );
}

export default PageHeader;
