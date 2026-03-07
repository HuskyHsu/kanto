import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    // Store the referrer when component mounts
    // This will be the page that brought us to this Pokemon detail page
    const storedReferrer = sessionStorage.getItem('pokemonListReferrer');
    if (storedReferrer) {
      setReferrer(storedReferrer);
    }
  }, []);

  const handleBack = () => {
    // If we have a stored referrer that looks like the home page (with or without filters)
    // navigate back to it to preserve filters
    if (referrer && (referrer === '/' || referrer.startsWith('/?'))) {
      navigate(referrer);
    } else {
      // Otherwise, just go to home
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className='inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-press-start text-slate-700 bg-white border-[3px] border-slate-300 rounded-[8px] hover:bg-slate-100 hover:border-slate-400 hover:-translate-y-1 transition-all duration-100 shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-[2px_4px_0_0_rgba(148,163,184,1)] active:translate-y-0 active:shadow-none'
    >
      <ArrowLeft size={16} className='stroke-3' />
      Back
    </button>
  );
}
