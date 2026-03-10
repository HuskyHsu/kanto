import { Link } from 'react-router-dom';

export default function PageHeader() {
  return (
    <h1 className='flex items-center gap-2 text-2xl font-bold'>
      <img
        src={`${import.meta.env.BASE_URL}images/logo.png`}
        className='w-16 h-16 md:w-20 md:h-20'
      />
      <Link
        to={`/`}
        className='font-press-start text-base md:text-xl tracking-tighter text-slate-700'
      >
        Move List
      </Link>
    </h1>
  );
}
