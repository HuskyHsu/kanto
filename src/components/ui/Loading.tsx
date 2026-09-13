import './Loading.css';

interface LoadingProps {
  size?: string;
}

export function Loading({ size = 'h-[50vh]' }: LoadingProps) {
  return (
    <div className={`flex ${size} w-full items-center justify-center`}>
      <div className='wobbling relative flex items-center justify-center'>
        <img
          src={`${import.meta.env.BASE_URL}images/type/PokemonBall_.png`}
          alt='Loading...'
          className='wobble-ball'
        />
      </div>
    </div>
  );
}
