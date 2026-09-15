import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanion, MAX_TEAM_SIZE } from '@/contexts/CompanionContext';
import { usePokemonContext } from '@/contexts/PokemonContext';
import { useLocationData } from '@/hooks/useLocationData';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Pokemon } from '@/types/pokemon';
import { Plus, X, Search, Settings2, Check, Compass, MapPin, ArrowUpToLine } from 'lucide-react';
import { PokemonIconLink } from '@/components/pokemon';
import {
  METHOD_ICONS,
  METHOD_ORDER,
  getEncounterMethodDisplayName,
} from '@/utils/encounterUtils';

interface AggregatedEncounter {
  pid: number;
  name: { zh: string; en: string; ja?: string };
  chance: number;
  minLevel: number;
  maxLevel: number;
}

interface EncounterMethodSection {
  method: string;
  name: string;
  icon: string;
  totalChance: number;
  encounters: AggregatedEncounter[];
}

export const TeamTab: React.FC = () => {
  const navigate = useNavigate();
  const {
    team,
    removeFromTeam,
    addToTeam,
    reorderTeam,
    moveToTop,
    isInTeam,
    currentViewingPid,
    selectedLocationId,
    setSelectedLocationId,
  } = useCompanion();

  const { pokemonList } = usePokemonContext();
  const { locationList, loading: loadingLocation } = useLocationData();
  const { displayLanguage } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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

  const isCurrentInTeam = currentViewingPokemon ? isInTeam(currentViewingPokemon.pid) : false;

  // Radar location
  const currentLocation = useMemo(() => {
    if (!locationList.length) return null;
    if (selectedLocationId) {
      const found = locationList.find((loc) => loc.id === selectedLocationId);
      if (found) return found;
    }
    const route1 = locationList.find((loc) => loc.id === 'route-1');
    return route1 || locationList[0];
  }, [locationList, selectedLocationId]);

  // Group encounters by (Area + Method) if multiple areas exist (e.g. 1F - 草叢/走路, B1F - 草叢/走路)
  const methodSections = useMemo((): EncounterMethodSection[] => {
    if (!currentLocation) return [];

    const hasMultipleAreas = currentLocation.areas.length > 1;
    const sections: EncounterMethodSection[] = [];

    currentLocation.areas.forEach((area, areaIdx) => {
      const areaName = hasMultipleAreas ? area.name.zh || area.name.en || `${areaIdx + 1}F` : '';

      // Group by method within this specific area
      const methodMap = new Map<string, Map<number, AggregatedEncounter>>();

      area.encounters.forEach((enc) => {
        const m = enc.method;
        if (!methodMap.has(m)) {
          methodMap.set(m, new Map<number, AggregatedEncounter>());
        }
        const pidMap = methodMap.get(m)!;
        const existing = pidMap.get(enc.pid);

        if (existing) {
          existing.chance += enc.chance;
          existing.minLevel = Math.min(existing.minLevel, enc.minLevel);
          existing.maxLevel = Math.max(existing.maxLevel, enc.maxLevel);
        } else {
          pidMap.set(enc.pid, {
            pid: enc.pid,
            name: enc.name,
            chance: enc.chance,
            minLevel: enc.minLevel,
            maxLevel: enc.maxLevel,
          });
        }
      });

      // Sort methods in this area by game order
      const sortedMethods = Array.from(methodMap.entries()).sort((a, b) => {
        const orderA = METHOD_ORDER[a[0]] ?? 99;
        const orderB = METHOD_ORDER[b[0]] ?? 99;
        return orderA - orderB;
      });

      sortedMethods.forEach(([method, pidMap]) => {
        const encounters = Array.from(pidMap.values()).sort((a, b) => b.chance - a.chance);
        const totalChance = encounters.reduce((sum, e) => sum + e.chance, 0);
        const baseMethodName = getEncounterMethodDisplayName(method, displayLanguage);
        const displayName = hasMultipleAreas ? `${areaName} - ${baseMethodName}` : baseMethodName;
        const methodIcon = METHOD_ICONS[method] || '📍';

        sections.push({
          method: `${areaIdx}-${method}`,
          name: displayName,
          icon: methodIcon,
          totalChance,
          encounters,
        });
      });
    });

    return sections;
  }, [currentLocation, displayLanguage]);

  const totalWildCount = useMemo(() => {
    const pids = new Set<number>();
    methodSections.forEach((sec) => sec.encounters.forEach((e) => pids.add(e.pid)));
    return pids.size;
  }, [methodSections]);

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
    const res = addToTeam(p.pid);
    if (!res.success) {
      showToast(res.message || '加入失敗');
    } else {
      setSearchQuery('');
      setIsSearching(false);
      showToast('已成功添加！');
    }
  };

  const handleAddCurrentViewing = () => {
    if (!currentViewingPokemon) return;
    const res = addToTeam(currentViewingPokemon.pid);
    if (!res.success) {
      showToast(res.message || '加入失敗');
    } else {
      showToast('已加入隊伍！');
    }
  };

  const handleRemoveFromTeam = (pid: number) => {
    removeFromTeam(pid);
    showToast('已移出隊伍');
    if (team.length <= 1) {
      setIsEditing(false);
    }
  };

  // Render team slots dynamically: existing members + 1 empty slot (up to MAX_TEAM_SIZE)
  const renderTeamSlots = () => {
    const slots = [];

    // Render existing members
    team.forEach((pid, i) => {
      const pm = pokemonMap.get(pid);
      const isLead = i === 0;
      slots.push(
        <div
          key={`team-${pid}-${i}`}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = 'move';
            setDraggedIndex(i);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (dragOverIndex !== i) {
              setDragOverIndex(i);
            }
          }}
          onDragLeave={() => {
            if (dragOverIndex === i) {
              setDragOverIndex(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedIndex !== null && draggedIndex !== i) {
              reorderTeam(draggedIndex, i);
              showToast('順序已更新！');
            }
            setDraggedIndex(null);
            setDragOverIndex(null);
          }}
          onDragEnd={() => {
            setDraggedIndex(null);
            setDragOverIndex(null);
          }}
          onClick={() => {
            if (isEditing) {
              if (i > 0) {
                moveToTop(pid);
                showToast(`已將【${pm?.name.zh || pid}】置頂！`);
              }
            } else {
              navigate(`/pokemon/${pid}`);
            }
          }}
          className={`group relative aspect-square rounded-[8px] border-2 flex items-center justify-center transition-all select-none ${
            isEditing
              ? 'border-amber-400 bg-amber-50/20 shadow-[1px_1px_0_0_rgba(251,191,36,0.5)] cursor-pointer hover:border-amber-500 hover:shadow-[2px_2px_0_0_rgba(251,191,36,0.8)]'
              : 'border-slate-300 hover:border-[#34925e] shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-[2px_3px_0_0_rgba(52,146,94,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer'
          } ${dragOverIndex === i ? 'ring-2 ring-emerald-500 scale-105 z-20' : ''} ${
            draggedIndex === i ? 'opacity-40 scale-95' : ''
          }`}
          title={
            isEditing
              ? isLead
                ? `${pm?.name.zh || pid} (首位，可拖曳排序)`
                : `${pm?.name.zh || pid} (點擊置頂，或拖曳排序)`
              : pm
                ? `${pm.name.zh} #${pm.pid}`
                : undefined
          }
        >
          {/* Inner Pokemon Sprite Box with clipped rounded corners */}
          <div className='w-full h-full rounded-[6px] overflow-hidden flex items-center justify-center pointer-events-none'>
            <PokemonIconLink
              pokemon={pm || { pid, name: { zh: `#${pid}`, en: `#${pid}`, ja: '' } }}
              className='p-0 w-full h-full'
              disableLink
              fillBg
            />
          </div>

          {/* Move to Top Action Bar in edit mode (Only on other members, not the first one) */}
          {isEditing && !isLead && (
            <div
              className='absolute bottom-0 inset-x-0 bg-amber-400 text-slate-900 text-[9px] font-bold py-0.5 flex items-center justify-center gap-0.5 rounded-b-[6px] shadow-xs group-hover:bg-amber-300 transition-colors z-20'
            >
              <ArrowUpToLine className='w-2.5 h-2.5 stroke-3' />
              <span>置頂</span>
            </div>
          )}

          {/* Edit Delete Button */}
          {isEditing && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromTeam(pid);
              }}
              title='移出隊伍'
              className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#e05038] hover:bg-rose-700 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer transition-transform hover:scale-110 z-30'
            >
              <X className='w-2.5 h-2.5 stroke-3' />
            </button>
          )}
        </div>
      );
    });

    // Render exactly one empty slot if team is not full
    if (team.length < MAX_TEAM_SIZE) {
      slots.push(
        <div
          key='team-empty-slot'
          onClick={() => {
            if (currentViewingPokemon && !isCurrentInTeam) {
              handleAddCurrentViewing();
            } else {
              setIsSearching(true);
            }
          }}
          className='aspect-square rounded-[8px] border-2 border-dashed border-slate-300 hover:border-[#34925e] bg-white/60 hover:bg-emerald-50/40 flex flex-col items-center justify-center cursor-pointer transition-all shadow-[1px_1px_0_0_rgba(203,213,225,0.6)] group'
          title={
            currentViewingPokemon && !isCurrentInTeam
              ? `點擊將當前【${currentViewingPokemon.name.zh}】填入此位`
              : '點擊搜尋添加'
          }
        >
          <Plus className='w-3.5 h-3.5 text-slate-300 group-hover:text-[#34925e] transition-colors stroke-3' />
        </div>
      );
    }

    return slots;
  };

  return (
    <div className='p-2 space-y-3'>
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
            <div className='w-10 h-10 rounded-[4px] border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden'>
              <PokemonIconLink
                pokemon={currentViewingPokemon}
                className='p-0 w-full h-full'
                disableLink
                fillBg
              />
            </div>
            <span className='text-xs font-bold text-slate-800 truncate'>
              {currentViewingPokemon.name.zh}
            </span>
          </div>

          {isCurrentInTeam ? (
            <span className='text-[10px] text-center font-press-start text-[#34925e] bg-emerald-50 py-1 rounded-[4px] border border-emerald-200'>
              ✓ IN TEAM
            </span>
          ) : (
            <button
              onClick={handleAddCurrentViewing}
              className='w-full py-1.5 px-2 text-[10px] font-press-start bg-[#34925e] hover:bg-[#2c7a4f] text-white rounded-[6px] border border-[#276e46] shadow-[2px_2px_0_0_rgba(39,110,70,1)] hover:shadow-[1px_1px_0_0_rgba(39,110,70,1)] hover:translate-y-px active:shadow-none flex items-center justify-center gap-1 transition-all cursor-pointer'
            >
              <Plus className='w-3 h-3 stroke-3' /> 加入隊伍
            </button>
          )}
        </div>
      )}

      {/* Mini Search Bar / Trigger */}
      {isSearching ? (
        <div className='bg-white border-2 border-slate-300 rounded-[8px] p-2 space-y-1.5 shadow-[2px_2px_0_0_rgba(203,213,225,1)]'>
          <div className='flex items-center justify-between text-[10px] font-bold text-slate-700'>
            <span>新增至隊伍</span>
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
                    <div className='w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden scale-75 -my-1'>
                      <PokemonIconLink
                        pokemon={pm}
                        className='p-0 w-full h-full'
                        disableLink
                        hideTypeBg
                      />
                    </div>
                    <span className='truncate font-medium text-slate-800'>{pm.name.zh}</span>
                  </div>
                  <Plus className='w-3.5 h-3.5 text-[#34925e] shrink-0 stroke-3' />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Edit Mode Switch */}
      {/* Edit Mode Switch (Only shown when team has members) */}
      {team.length > 0 && (
        <div className='flex items-center justify-between px-1 pb-0.5 border-b border-slate-200'>
          <div className='flex items-center gap-1.5'>
            <span className='text-[10px] font-press-start text-slate-400'>
              {isEditing ? 'EDITING' : 'READY'}
            </span>
            {isEditing && (
              <span className='text-[9px] text-amber-600 font-sans'>
                (可拖曳或點擊置頂)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[9px] font-press-start transition-all cursor-pointer ${
              isEditing
                ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-[1px_1px_0_0_rgba(251,191,36,1)]'
                : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-slate-400 shadow-[1px_1px_0_0_rgba(203,213,225,1)] hover:translate-y-px hover:shadow-none'
            }`}
            title={isEditing ? '完成編輯' : '切換為刪除模式'}
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
      )}

      {/* Section 1: 隊伍清單 (TEAM: 動態空格，上限 MAX_TEAM_SIZE) */}
      <div className='space-y-1'>
        <div className='flex items-center justify-between px-0.5'>
          <div className='flex items-center gap-1 text-[10px] font-press-start text-slate-700 uppercase'>
            <span className='w-1.5 h-1.5 rounded-full bg-[#34925e]'></span>
            <span>TEAM</span>
            <span className='text-slate-400 font-mono text-[11px]'>
              ({team.length}/{MAX_TEAM_SIZE})
            </span>
          </div>
          {!isSearching && team.length < MAX_TEAM_SIZE && (
            <button
              onClick={() => setIsSearching(true)}
              title='搜尋添加'
              className='p-0.5 text-slate-400 hover:text-[#34925e]'
            >
              <Search className='w-3 h-3 stroke-3' />
            </button>
          )}
        </div>

        {/* Dynamic Slots in 3 Columns */}
        <div className='grid grid-cols-3 gap-1.5'>
          {renderTeamSlots()}
        </div>
      </div>

      {/* Section 2: 地圖雷達 (Radar: Location + Grouped by Encounter Method) */}
      <div className='space-y-2 pt-2 border-t-2 border-slate-200'>
        <div className='flex items-center justify-between px-0.5'>
          <div className='flex items-center gap-1 text-[10px] font-press-start text-slate-700 uppercase'>
            <Compass className='w-3 h-3 text-[#34925e]' />
            <span>RADAR</span>
          </div>
          <span className='text-[10px] font-mono text-slate-400'>
            {totalWildCount} 種寶可夢
          </span>
        </div>

        {/* Location Dropdown */}
        <select
          value={currentLocation?.id || ''}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          className='w-full px-2 py-1 text-[11px] font-bold bg-white border-2 border-slate-300 rounded-[6px] shadow-[1px_1px_0_0_rgba(203,213,225,1)] text-slate-800 focus:outline-none focus:border-[#34925e] cursor-pointer truncate'
        >
          {locationList.map((loc) => {
            const locName = loc.name.zh;
            const subName = loc.name[displayLanguage] || loc.name.en;
            return (
              <option key={loc.id} value={loc.id}>
                {loc.region === 'sevii' ? '七島 ' : ''}{locName} ({subName})
              </option>
            );
          })}
        </select>

        {/* Wild Encounters Grouped by Method (Walk, Surf, Rods, etc.) */}
        {loadingLocation ? (
          <div className='text-center py-4 text-[10px] font-press-start text-slate-400'>
            LOADING...
          </div>
        ) : !currentLocation || methodSections.length === 0 ? (
          <div className='text-center py-3 border-2 border-dashed border-slate-300 rounded-[8px] bg-white shadow-[1px_1px_0_0_rgba(203,213,225,0.6)]'>
            <MapPin className='w-4 h-4 text-slate-300 mx-auto mb-0.5' />
            <p className='text-[9px] font-press-start text-slate-400'>NO WILD PM</p>
          </div>
        ) : (
          <div className='space-y-2.5'>
            {methodSections.map((section) => (
              <div key={section.method} className='space-y-1'>
                {/* Method Sub-Header */}
                <div className='flex items-center justify-between text-[10px] font-bold text-slate-700 bg-slate-100/90 px-1.5 py-0.5 rounded-[4px] border border-slate-200'>
                  <span className='flex items-center gap-1'>
                    <span>{section.icon}</span>
                    <span>{section.name}</span>
                  </span>
                  <span className='font-mono text-[9px] text-slate-400 font-semibold'>
                    {section.encounters.length} 隻 ({section.totalChance}%)
                  </span>
                </div>

                {/* Encounters Grid for this Method (3 Columns) */}
                <div className='grid grid-cols-3 gap-1.5'>
                  {section.encounters.map((enc) => {
                    const pm = pokemonMap.get(enc.pid) || { pid: enc.pid, name: enc.name };
                    return (
                      <div
                        key={`${section.method}-${enc.pid}`}
                        className='group relative aspect-square rounded-[8px] bg-white border-2 border-slate-300 hover:border-[#34925e] flex flex-col items-center justify-center overflow-hidden transition-all shadow-[2px_2px_0_0_rgba(203,213,225,1)] hover:shadow-[2px_3px_0_0_rgba(52,146,94,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer'
                        title={`${enc.name.zh} #${enc.pid} (Lv.${enc.minLevel === enc.maxLevel ? enc.minLevel : `${enc.minLevel}-${enc.maxLevel}`}，機率: ${enc.chance}%)`}
                      >
                        <PokemonIconLink
                          pokemon={pm}
                          className='p-0 w-full h-full'
                          fillBg
                        />
                        <span className='absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-slate-500 group-hover:text-[#34925e] bg-white/80 px-0.5 rounded-xs z-20 pointer-events-none'>
                          {enc.chance}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
