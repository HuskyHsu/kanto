import { cn } from '@/lib/utils';

interface PokemonNumberProps {
  number: number;
  colorClasses: string;
}

function PokemonNumber({ number, colorClasses }: PokemonNumberProps) {
  return (
    <span
      className={cn(
        'group-hover:text-yellow-400 inline-block',
        'text-white px-2 py-1 rounded-full',
        'bg-linear-to-br',
        colorClasses,
        'text-center text-[12px] tracking-widest',
        'transition-colors duration-100 ease-linear',
        'font-press-start shadow-sm leading-none',
      )}
      style={{
        textShadow: '1px 1px 0px rgba(0,0,0,0.4)',
      }}
    >
      No.{number.toString().padStart(3, '0')}
    </span>
  );
}

export default PokemonNumber;
