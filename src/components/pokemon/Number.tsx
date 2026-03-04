import { cn } from '@/lib/utils';

interface PokemonNumberProps {
  number: number;
}

function PokemonNumber({ number }: PokemonNumberProps) {
  return (
    <span
      className={cn(
        'group-hover:text-yellow-400 mb-2',
        'text-white text-center font-bold text-4xl drop-shadow-lg',
        'transition-all duration-300',
      )}
      style={{
        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      {number.toString().padStart(3, '0')}
    </span>
  );
}

export default PokemonNumber;
