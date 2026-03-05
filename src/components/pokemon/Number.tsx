import { cn } from '@/lib/utils';

interface PokemonNumberProps {
  number: number;
}

function PokemonNumber({ number }: PokemonNumberProps) {
  return (
    <span
      className={cn(
        'group-hover:text-yellow-400 mb-2',
        'text-white text-center text-2xl mt-2',
        'transition-colors duration-100 ease-linear',
        'font-press-start',
      )}
      style={{
        textShadow: '3px 3px 0px rgba(0,0,0,1)',
      }}
    >
      {number.toString().padStart(3, '0')}
    </span>
  );
}

export default PokemonNumber;
