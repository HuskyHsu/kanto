import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanion } from '@/contexts/CompanionContext';
import { usePokemonContext } from '@/contexts/PokemonContext';
import type { Pokemon } from '@/types/pokemon';
import { Plus, X, ArrowDownUp, Search, Settings2, Check } from 'lucide-react';

export const TeamTab: React.FC = () => {
  const navigate = useNavigate();
  const {
    party,
    box,
    removeFromTeam,
    moveToBox,
    moveToParty,
    addToParty,
    addToBox,
    isInTeam,
    currentViewingPid,
  } = useCompanion();
  const { pokemonList } = usePokemonContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetSlot, setTargetSlot] = useState<'party' | 'box'>('party');
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const pokemonMap = useMemo(() => {
    const map = new Map<number, Pokemon>();
    pokemonList.forEach((p) => map.set(p.pid, p));
    return map;
  }, [pokemonList]);

  // Derived from currentViewingPid in CompanionContext
  const currentViewingPokemon = useMemo(() => {
    if (!currentViewingPid) return null;
    return pokemonMap.get(currentViewingPid) || null;
  }, [pokemonMap, currentViewingPid]);

  const currentStatus = currentViewingPokemon ? isInTeam(currentViewingPokemon.pid) : null;

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return pokemonList
      .filter((p) => {
        const matchZh = p.name.zh.toLowerCase().includes(q);
        const matchEn = p.name.en.toLowerCase().includes(q);
        const matchPid = p.pid.toString() === q || `#${p.pid}` === q;
        return matchZh || matchEn || matchPid;
      })
      .slice(0, 8);
  }, [pokemonList, searchQuery]);

  const handleSelectPokemon = (p: Pokemon) => {
    const res = targetSlot === 'party' ? addToParty(p.pid) : addToBox(p.pid);
    if (!res.success) {
      showToast(res.message || '加入失敗');
    } else {
      setSearchQuery('');
      setIsSearching(false);
      showToast('已成功添加！');
    }
  };

  const handleAddCurrentViewing = (slot: 'party' | 'box' = 'party') => {
    if (!currentViewingPokemon) return;
    const res = slot === 'party' ? addToParty(currentViewingPokemon.pid) : addToBox(currentViewingPokemon.pid);
    if (!res.success) {
      if (slot === 'party') {
        const boxRes = addToBox(currentViewingPokemon.pid);
        if (boxRes.success) {
          showToast('主力已滿，已加入備用！');
          return;
        }
      }
      showToast(res.message || '加入失敗');
    } else {
      showToast(slot === 'party' ? '已加入主力隊伍！' : '已加入備用！');
    }
  };

  // Render 6 fixed slots (filled or empty)
  const renderSlots = (slotType: 'party' | 'box', list: number[], max = 6) => {
    const slots = [];
    for (let i = 0; i < max; i++) {
      const pid = list[i];
      if (pid) {
        const pm = pokemonMap.get(pid);
        slots.push(
          <div
            key={`${slotType}-${pid}-${i}`}
            className={`group relative aspect-square rounded-[8px] bg-white border-2 flex items-center justify-center p-1 transition-all ${
              isEditing
                ? 'border-amber-400 bg-amber-50/20 shadow-[2px_2px_0_0_rgba(251,191,36,0.5)]'
                : 'border-slate-300 hover:border-[#34925e] shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-[2px_3px_0_0_rgba(52,146,94,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer'
            }`}
            onClick={() => {
              if (!isEditing) {
                navigate(`/pokemon/${pid}`);
              }
            }}
            title={pm ? `${pm.name.zh} #${pm.pid}` : undefined}
          >
            {/* Pokemon Sprite (Always clear, pixel rendering) */}
            <img
              src={`${import.meta.env.BASE_URL}images/pmIcon/${pid}.png`}
              alt='Pokemon'
              className='w-11 h-11 object-contain [image-rendering:pixelated] group-hover:scale-110 transition-transform'
              loading='lazy'
            />

            {/* Edit Controls (Only visible in edit mode) */}
            {isEditing && (
              <>
                {/* Delete Button (Top Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromTeam(pid, slotType);
                    showToast('已移出隊伍');
                  }}
                  title='移出隊伍'
                  className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-[4px] bg-[#e05038] hover:bg-rose-700 text-white flex items-center justify-center border border-white shadow-[1px_1px_0_0_rgba(0,0,0,0.2)] cursor-pointer transition-transform hover:scale-110'
                >
                  <X className='w-3 h-3 stroke-3' />
                </button>

                {/* Move Button (Bottom Left) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slotType === 'party') {
                      const moved = moveToBox(pid);
                      if (!moved) showToast('備用名單已滿');
                      else showToast('已移至備用');
                    } else {
                      const moved = moveToParty(pid);
                      if (!moved) showToast('主力名單已滿');
                      else showToast('已移至主力');
                    }
                  }}
                  title={slotType === 'party' ? '移至備用' : '移至主力'}
                  className='absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-[4px] bg-slate-800 hover:bg-slate-900 text-amber-300 flex items-center justify-center border border-white shadow-[1px_1px_0_0_rgba(0,0,0,0.2)] cursor-pointer transition-transform hover:scale-110'
                >
                  <ArrowDownUp className='w-3 h-3' />
                </button>
              </>
            )}
          </div>
        );
      } else {
        // Empty Slot with Retro Look
        slots.push(
          <div
            key={`${slotType}-empty-${i}`}
            onClick={() => {
              if (currentViewingPokemon && !currentStatus?.inParty && !currentStatus?.inBox) {
                handleAddCurrentViewing(slotType);
              } else {
                setTargetSlot(slotType);
                setIsSearching(true);
              }
            }}
            className='aspect-square rounded-[8px] border-2 border-dashed border-slate-300 hover:border-[#34925e] bg-white/60 hover:bg-emerald-50/40 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[1px_1px_0_0_rgba(203,213,225,0.6)] group'
            title={
              currentViewingPokemon && !currentStatus?.inParty && !currentStatus?.inBox
                ? `點擊將當前【${currentViewingPokemon.name.zh}】填入此位`
                : '點擊搜尋添加'
            }
          >
            <Plus className='w-4 h-4 text-slate-300 group-hover:text-[#34925e] transition-colors stroke-3' />
          </div>
        );
      }
    }
    return slots;
  };

  return (
    <div className='p-2.5 space-y-3.5'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='text-center py-1 px-2 text-[10px] font-press-start bg-slate-800 text-[#34925e] rounded-[6px] border border-slate-700 shadow-md animate-fade-in'>
          {toastMessage}
        </div>
      )}

      {/* Quick Add Button if Currently Viewing a Pokemon */}
      {currentViewingPokemon && (
        <div className='bg-white border-2 border-[#34925e] rounded-[8px] p-2 flex flex-col gap-1.5 shadow-[2px_2px_0_0_rgba(52,146,94,0.2)]'>
          <div className='flex items-center gap-1.5 min-w-0'>
            <div className='w-7 h-7 rounded-[4px] bg-slate-100 border border-slate-300 flex items-center justify-center p-0.5 shrink-0'>
              <img
                src={`${import.meta.env.BASE_URL}images/pmIcon/${currentViewingPokemon.pid}.png`}
                alt={currentViewingPokemon.name.zh}
                className='w-6 h-6 object-contain [image-rendering:pixelated]'
              />
            </div>
            <span className='text-xs font-bold text-slate-800 truncate'>
              {currentViewingPokemon.name.zh}
            </span>
          </div>

          {currentStatus?.inParty ? (
            <span className='text-[10px] text-center font-press-start text-[#34925e] bg-emerald-50 py-1 rounded-[4px] border border-emerald-200'>
              ✓ PARTY
            </span>
          ) : currentStatus?.inBox ? (
            <span className='text-[10px] text-center font-press-start text-sky-700 bg-sky-50 py-1 rounded-[4px] border border-sky-200'>
              ✓ BOX
            </span>
          ) : (
            <button
              onClick={() => handleAddCurrentViewing('party')}
              className='w-full py-1.5 px-2 text-[10px] font-press-start bg-[#34925e] hover:bg-[#2c7a4f] text-white rounded-[6px] border border-[#276e46] shadow-[2px_2px_0_0_rgba(39,110,70,1)] hover:shadow-[1px_1px_0_0_rgba(39,110,70,1)] hover:translate-y-px active:shadow-none flex items-center justify-center gap-1 transition-all cursor-pointer'
            >
              <Plus className='w-3 h-3 stroke-3' /> 加入主力
            </button>
          )}
        </div>
      )}

      {/* Mini Search Bar / Trigger */}
      {isSearching ? (
        <div className='bg-white border-2 border-slate-300 rounded-[8px] p-2 space-y-1.5 shadow-[2px_2px_0_0_rgba(203,213,225,1)]'>
          <div className='flex items-center justify-between text-[10px] font-bold text-slate-700'>
            <span>新增至 {targetSlot === 'party' ? '主力' : '備用'}</span>
            <button onClick={() => setIsSearching(false)} className='text-slate-400 hover:text-slate-600'>
              <X className='w-3.5 h-3.5 stroke-3' />
            </button>
          </div>
          <input
            type='text'
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='搜尋名字或編號...'
            className='w-full px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#34925e]'
          />
          {searchResults.length > 0 && (
            <div className='max-h-36 overflow-y-auto space-y-1 pt-1'>
              {searchResults.map((pm) => (
                <div
                  key={pm.pid}
                  onClick={() => handleSelectPokemon(pm)}
                  className='flex items-center justify-between p-1 hover:bg-slate-100 rounded-[4px] cursor-pointer text-xs'
                >
                  <div className='flex items-center gap-1.5 truncate'>
                    <img
                      src={`${import.meta.env.BASE_URL}images/pmIcon/${pm.pid}.png`}
                      alt={pm.name.zh}
                      className='w-6 h-6 object-contain [image-rendering:pixelated]'
                    />
                    <span className='truncate font-medium text-slate-800'>{pm.name.zh}</span>
                  </div>
                  <Plus className='w-3.5 h-3.5 text-[#34925e] shrink-0 stroke-3' />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Global Mode Switch Header (Edit Mode vs Navigation Mode) */}
      <div className='flex items-center justify-between px-1 pb-1 border-b border-slate-200'>
        <span className='text-[10px] font-press-start text-slate-400'>
          {isEditing ? 'EDITING' : 'READY'}
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[9px] font-press-start transition-all cursor-pointer ${
            isEditing
              ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-[1px_1px_0_0_rgba(251,191,36,1)]'
              : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-slate-400 shadow-[1px_1px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:shadow-none'
          }`}
          title={isEditing ? '完成編輯' : '切換為移動/刪除模式'}
        >
          {isEditing ? (
            <>
              <Check className='w-2.5 h-2.5 text-emerald-700 stroke-3' />
              <span>DONE</span>
            </>
          ) : (
            <>
              <Settings2 className='w-2.5 h-2.5 text-slate-500' />
              <span>EDIT</span>
            </>
          )}
        </button>
      </div>

      {/* Section 1: 主力隊伍 (Party) - 2x3 Grid */}
      <div className='space-y-1.5'>
        <div className='flex items-center justify-between px-0.5'>
          <div className='flex items-center gap-1.5 text-[10px] font-press-start text-slate-700 uppercase'>
            <span className='w-1.5 h-1.5 rounded-full bg-[#34925e]'></span>
            <span>PARTY</span>
            <span className='text-slate-400 font-mono text-xs'>({party.length}/6)</span>
          </div>
          {!isSearching && (
            <button
              onClick={() => {
                setTargetSlot('party');
                setIsSearching(true);
              }}
              title='搜尋添加'
              className='p-1 text-slate-400 hover:text-[#34925e]'
            >
              <Search className='w-3 h-3 stroke-3' />
            </button>
          )}
        </div>

        <div className='grid grid-cols-2 gap-2'>
          {renderSlots('party', party)}
        </div>
      </div>

      {/* Section 2: 備用箱子 (Box) - 2x3 Grid */}
      <div className='space-y-1.5 pt-1.5 border-t border-slate-200'>
        <div className='flex items-center justify-between px-0.5'>
          <div className='flex items-center gap-1.5 text-[10px] font-press-start text-slate-700 uppercase'>
            <span className='w-1.5 h-1.5 rounded-full bg-sky-500'></span>
            <span>BOX</span>
            <span className='text-slate-400 font-mono text-xs'>({box.length}/6)</span>
          </div>
          {!isSearching && (
            <button
              onClick={() => {
                setTargetSlot('box');
                setIsSearching(true);
              }}
              title='搜尋添加'
              className='p-1 text-slate-400 hover:text-sky-600'
            >
              <Search className='w-3 h-3 stroke-3' />
            </button>
          )}
        </div>

        <div className='grid grid-cols-2 gap-2'>
          {renderSlots('box', box)}
        </div>
      </div>
    </div>
  );
};
