import { useState } from 'react';
import { useCompanion } from '@/contexts/CompanionContext';
import { Check, Plus, ChevronDown, Trash2, ArrowDownUp } from 'lucide-react';

interface TeamActionButtonProps {
  pid: number;
}

export const TeamActionButton: React.FC<TeamActionButtonProps> = ({ pid }) => {
  const { isInTeam, addToParty, addToBox, removeFromTeam, moveToBox, moveToParty, setIsOpen, setActiveTab } =
    useCompanion();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { inParty, inBox } = isInTeam(pid);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleQuickAdd = () => {
    const res = addToParty(pid);
    if (res.success) {
      showToast('已加入主力隊伍！');
    } else {
      // Try adding to box if party is full
      const boxRes = addToBox(pid);
      if (boxRes.success) {
        showToast('主力已滿，已自動加入備用隊伍！');
      } else {
        showToast(res.message || '加入失敗');
      }
    }
  };

  return (
    <div className='relative inline-block'>
      {toastMsg && (
        <div className='absolute -top-9 right-0 px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in'>
          {toastMsg}
        </div>
      )}

      {inParty ? (
        <div className='inline-flex items-center rounded-[8px] border-[3px] border-emerald-500 bg-emerald-50 text-emerald-800 shadow-[2px_2px_0_0_rgba(16,185,129,0.3)]'>
          <button
            onClick={() => {
              setActiveTab('team');
              setIsOpen(true);
            }}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-press-start hover:bg-emerald-100 transition-colors'
            title='點擊開啟冒險助手抽屜'
          >
            <Check className='w-3.5 h-3.5 text-emerald-600 stroke-3' />
            PARTY
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='p-1.5 border-l border-emerald-300 hover:bg-emerald-100 transition-colors'
          >
            <ChevronDown className='w-3.5 h-3.5' />
          </button>
        </div>
      ) : inBox ? (
        <div className='inline-flex items-center rounded-[8px] border-[3px] border-sky-500 bg-sky-50 text-sky-800 shadow-[2px_2px_0_0_rgba(14,165,233,0.3)]'>
          <button
            onClick={() => {
              setActiveTab('team');
              setIsOpen(true);
            }}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-press-start hover:bg-sky-100 transition-colors'
            title='點擊開啟冒險助手抽屜'
          >
            <Check className='w-3.5 h-3.5 text-sky-600 stroke-3' />
            BOX
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='p-1.5 border-l border-sky-300 hover:bg-sky-100 transition-colors'
          >
            <ChevronDown className='w-3.5 h-3.5' />
          </button>
        </div>
      ) : (
        <button
          onClick={handleQuickAdd}
          className='inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-press-start text-slate-700 bg-white border-[3px] border-slate-300 rounded-[8px] hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-800 hover:-translate-y-1 transition-all duration-100 shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-[2px_4px_0_0_rgba(16,185,129,0.3)] active:translate-y-0 active:shadow-none'
        >
          <Plus className='w-3.5 h-3.5 stroke-3 text-emerald-600' />
          加入隊伍
        </button>
      )}

      {/* Action Dropdown Menu */}
      {dropdownOpen && (
        <div className='absolute right-0 mt-1 w-36 bg-white border-2 border-slate-300 rounded-lg shadow-xl py-1 z-50 text-xs font-medium text-slate-700'>
          {inParty && (
            <button
              onClick={() => {
                const moved = moveToBox(pid);
                if (!moved) showToast('備用名單已滿 (6 隻)');
                setDropdownOpen(false);
              }}
              className='w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-1.5 text-slate-700'
            >
              <ArrowDownUp className='w-3.5 h-3.5 text-sky-600' />
              移至備用 (Box)
            </button>
          )}
          {inBox && (
            <button
              onClick={() => {
                const moved = moveToParty(pid);
                if (!moved) showToast('主力名單已滿 (6 隻)');
                setDropdownOpen(false);
              }}
              className='w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-1.5 text-slate-700'
            >
              <ArrowDownUp className='w-3.5 h-3.5 text-emerald-600' />
              移至主力 (Party)
            </button>
          )}
          <button
            onClick={() => {
              removeFromTeam(pid);
              setDropdownOpen(false);
              showToast('已從隊伍中移除');
            }}
            className='w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-1.5'
          >
            <Trash2 className='w-3.5 h-3.5' />
            移出隊伍
          </button>
        </div>
      )}
    </div>
  );
};
