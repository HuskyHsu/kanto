import React, { useEffect } from 'react';
import { useCompanion } from '@/contexts/CompanionContext';
import { TeamTab } from './TeamTab';
import { RadarTab } from './RadarTab';
import { X, Users, MapPin } from 'lucide-react';

export const CompanionDrawer: React.FC = () => {
  const { isOpen, setIsOpen, activeTab, setActiveTab, party } = useCompanion();

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-hidden pointer-events-none'>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className='absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] transition-opacity animate-fade-in pointer-events-auto'
      />

      {/* Retro Companion Drawer Panel */}
      <div className='absolute inset-y-0 right-0 max-w-full flex pointer-events-auto'>
        <div className='w-[220px] bg-[#f8fafc] shadow-2xl flex flex-col border-l-[3px] border-[#34925e] animate-slide-left'>
          {/* Retro Header */}
          <div className='px-3 py-2.5 bg-white border-b-2 border-slate-200 flex items-center justify-between shrink-0 relative pl-4 before:content-[""] before:absolute before:left-0 before:top-[18%] before:h-[64%] before:w-1.5 before:bg-[#e05038]'>
            <div className='flex items-center gap-1.5'>
              <h2 className='font-press-start text-[10px] text-slate-800 tracking-wide uppercase'>
                Companion
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='p-1 rounded-[6px] bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-600 shadow-[1px_1px_0_0_rgba(203,213,225,1)] active:translate-y-px active:shadow-none transition-all cursor-pointer'
              title='關閉 (ESC)'
            >
              <X className='w-3.5 h-3.5 stroke-3' />
            </button>
          </div>

          {/* Retro Navigation Tabs */}
          <div className='flex border-b-2 border-slate-200 bg-slate-100/70 shrink-0 p-1.5 gap-1.5'>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[6px] text-[10px] font-press-start transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-white text-[#34925e] border-2 border-[#34925e] shadow-[1px_1px_0_0_rgba(52,146,94,0.4)]'
                  : 'bg-white text-slate-500 border-2 border-slate-300 hover:border-slate-400 shadow-[1px_1px_0_0_rgba(203,213,225,1)]'
              }`}
            >
              <Users className='w-3 h-3' />
              <span>隊伍</span>
              <span className='text-[9px] font-mono font-bold text-slate-400'>
                {party.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[6px] text-[10px] font-press-start transition-all cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-white text-[#34925e] border-2 border-[#34925e] shadow-[1px_1px_0_0_rgba(52,146,94,0.4)]'
                  : 'bg-white text-slate-500 border-2 border-slate-300 hover:border-slate-400 shadow-[1px_1px_0_0_rgba(203,213,225,1)]'
              }`}
            >
              <MapPin className='w-3 h-3' />
              <span>雷達</span>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className='flex-1 overflow-y-auto'>
            {activeTab === 'team' ? <TeamTab /> : <RadarTab />}
          </div>
        </div>
      </div>
    </div>
  );
};
