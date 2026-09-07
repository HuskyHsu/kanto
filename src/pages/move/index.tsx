import PageViewToggle from '@/components/PageViewToggle';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useMoveData } from '@/hooks/useMoveData';
import { useUrlParams } from '@/hooks/useUrlParams';
import type { Move } from '@/types/move';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MoveFilter, MoveListCard, PageHeader, SearchFilter } from './components';
import MoveIntersectionResult from './components/MoveIntersectionResult';

export default function MoveList() {
  const { moveList, loading, error } = useMoveData();
  const { getParam, setParam } = useUrlParams();
  const searchKeyword = getParam('search') || '';
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTM, setIsTM] = useState(false);
  const [selectedMoveIds, setSelectedMoveIds] = useState<number[]>([]);

  const handleSearchChange = useCallback(
    (keyword: string) => {
      setParam('search', keyword);
    },
    [setParam],
  );

  const keywordMatches = useCallback((move: Move, keyword: string) => {
    if (!keyword.trim()) return true;

    const normalizedKeyword = keyword.toLowerCase().trim();

    // Search in names (zh, ja, en)
    const nameMatches =
      move.name.zh.toLowerCase().includes(normalizedKeyword) ||
      move.name.ja.toLowerCase().includes(normalizedKeyword) ||
      move.name.en.toLowerCase().includes(normalizedKeyword);

    // Search in id
    const idMatches = move.id.toString().includes(normalizedKeyword);

    // Search in TM / HM
    let tmMatches = false;
    if (move.tm !== undefined && move.tm !== null) {
      const tmStr = move.tm.toString().toLowerCase();
      const tmDigits = tmStr.replace(/\D/g, '');
      const tmNum = tmDigits ? parseInt(tmDigits, 10).toString() : '';

      tmMatches =
        tmStr.includes(normalizedKeyword) ||
        `tm${tmStr}`.includes(normalizedKeyword) ||
        `tm ${tmStr}`.includes(normalizedKeyword) ||
        (tmNum ? `tm${tmNum}`.includes(normalizedKeyword) || `tm ${tmNum}`.includes(normalizedKeyword) : false) ||
        (tmStr.includes('秘傳') && tmDigits
          ? `hm${tmDigits}`.includes(normalizedKeyword) ||
            `hm ${tmDigits}`.includes(normalizedKeyword) ||
            `hm${tmNum}`.includes(normalizedKeyword) ||
            `hm ${tmNum}`.includes(normalizedKeyword)
          : false);
    }

    // Search in type
    const typeMatches = move.type.toLowerCase().includes(normalizedKeyword);

    return nameMatches || idMatches || tmMatches || typeMatches;
  }, []);

  const filteredMoves = useMemo(() => {
    let result = moveList.filter((move) => {
      const typeMatch = selectedType === null || move.type === selectedType;
      const categoryMatch = selectedCategory === null || move.category === selectedCategory;
      const tmMatch = !isTM || move.tm !== undefined;
      const searchMatch = keywordMatches(move, searchKeyword);
      return typeMatch && categoryMatch && tmMatch && searchMatch;
    });

    if (isTM) {
      result = result.sort((a, b) => {
        const aIsHM = a.tm?.toString().includes('秘傳');
        const bIsHM = b.tm?.toString().includes('秘傳');

        if (aIsHM && !bIsHM) {
          return -1;
        }
        if (!aIsHM && bIsHM) {
          return 1;
        }

        const aNum = parseInt(a.tm?.toString().replace('秘傳', '') || '0', 10);
        const bNum = parseInt(b.tm?.toString().replace('秘傳', '') || '0', 10);
        return aNum - bNum;
      });
    }

    return result;
  }, [moveList, selectedType, selectedCategory, isTM, searchKeyword, keywordMatches]);

  useEffect(() => {
    document.title = 'Move List - Kanto Pokédex';
  }, []);

  const handleToggleMove = (moveId: number) => {
    setSelectedMoveIds((prev) => {
      if (prev.includes(moveId)) {
        return prev.filter((id) => id !== moveId);
      }
      if (prev.length >= 6) {
        return prev;
      }
      return [...prev, moveId];
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PageViewToggle />

      <MoveIntersectionResult selectedMoveIds={selectedMoveIds} onRemoveMove={handleToggleMove} />

      <SearchFilter searchKeyword={searchKeyword} onSearchChange={handleSearchChange} />

      <MoveFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isTM={isTM}
        onTMChange={setIsTM}
      />
      <MoveListCard
        moveList={filteredMoves}
        selectedMoveIds={selectedMoveIds}
        onToggleMove={handleToggleMove}
      />
    </div>
  );
}
