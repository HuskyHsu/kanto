import PageViewToggle from '@/components/PageViewToggle';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useMoveData } from '@/hooks/useMoveData';
import { useEffect, useMemo, useState } from 'react';
import { MoveFilter, MoveListCard, PageHeader } from './components';
import MoveIntersectionResult from './components/MoveIntersectionResult';

export default function MoveList() {
  const { moveList, loading, error } = useMoveData();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTM, setIsTM] = useState(false);
  const [selectedMoveIds, setSelectedMoveIds] = useState<number[]>([]);

  const filteredMoves = useMemo(() => {
    let result = moveList.filter((move) => {
      const typeMatch = selectedType === null || move.type === selectedType;
      const categoryMatch = selectedCategory === null || move.category === selectedCategory;
      const tmMatch = !isTM || move.tm !== undefined;
      return typeMatch && categoryMatch && tmMatch;
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
  }, [moveList, selectedType, selectedCategory, isTM]);

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
