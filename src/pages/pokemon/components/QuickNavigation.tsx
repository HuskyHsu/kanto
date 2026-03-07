import { Cat, ChartPie, ChevronDown, ChevronUp, Split, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuickNavigationProps {
  hasEvolution: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QuickNavigation = ({ hasEvolution }: QuickNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>('basic-info');
  const [isNearBottom, setIsNearBottom] = useState(false);

  const navItems: NavItem[] = [
    { id: 'basic-info', label: 'Basic Info', icon: Cat },
    { id: 'moves', label: 'Moves', icon: Swords },
    { id: 'stats', label: 'Stats', icon: ChartPie },
    ...(hasEvolution ? [{ id: 'evolution', label: 'Evolution', icon: Split }] : []),
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if near bottom
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      setIsNearBottom(distanceFromBottom <= 30); // 30px threshold

      // Find which section is currently in view
      const sections = navItems.map((item) => document.getElementById(item.id));
      const viewportHeight = window.innerHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= viewportHeight / 2) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <div
      className={`fixed ${
        isNearBottom ? 'bottom-36 md:bottom-24' : 'bottom-8'
      } left-1/2 transform -translate-x-1/2 z-50 lg:hidden transition-all duration-600`}
    >
      <div className='bg-white rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] border-[3px] border-[#34925e] p-2 flex items-center space-x-1 sm:space-x-2'>
        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          className='w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 rounded-sm shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all duration-100'
          aria-label='Scroll to top'
        >
          <ChevronUp className='w-5 h-5 text-slate-700 stroke-3' />
        </button>

        {/* Section navigation */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`w-10 h-10 flex items-center justify-center transition-all duration-100 font-press-start ${
              activeSection === item.id
                ? 'bg-amber-100 border-2 border-amber-400 rounded-sm shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)] text-amber-900 scale-110'
                : 'bg-white border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 rounded-sm shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none text-slate-600'
            }`}
            aria-label={`Scroll to ${item.label}`}
            title={item.label}
          >
            <item.icon
              className={`w-5 h-5 ${activeSection === item.id ? 'stroke-3 text-amber-600' : 'stroke-2'}`}
            />
          </button>
        ))}

        {/* Scroll to bottom */}
        <button
          onClick={scrollToBottom}
          className='w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 rounded-sm shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all duration-100'
          aria-label='Scroll to bottom'
        >
          <ChevronDown className='w-5 h-5 text-slate-700 stroke-3' />
        </button>
      </div>
    </div>
  );
};

export default QuickNavigation;
