import PageViewToggle from '@/components/PageViewToggle';
import { Card, CardContent } from '@/components/ui/card';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useLocationData } from '@/hooks/useLocationData';
import { useUrlParams } from '@/hooks/useUrlParams';
import type { GameLocation } from '@/types/location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocationFilter, LocationListCard, PageHeader, SearchFilter } from './components';

export default function LocationList() {
  const { locationList, loading, error } = useLocationData();
  const { getParam, setParam } = useUrlParams();
  const searchKeyword = getParam('search') || '';

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleSearchChange = useCallback(
    (keyword: string) => {
      setParam('search', keyword);
    },
    [setParam],
  );

  const keywordMatches = useCallback((loc: GameLocation, keyword: string) => {
    if (!keyword.trim()) return true;

    const term = keyword.toLowerCase().trim();

    // 1. Matches location name in zh, en, ja, id
    const locZh = loc.name.zh?.toLowerCase() || '';
    const locEn = loc.name.en?.toLowerCase() || '';
    const locJa = loc.name.ja?.toLowerCase() || '';
    const locId = loc.id.toLowerCase();

    if (
      locZh.includes(term) ||
      locEn.includes(term) ||
      locJa.includes(term) ||
      locId.includes(term)
    ) {
      return true;
    }

    // 2. Matches sub-areas
    for (const area of loc.areas) {
      const aZh = area.name.zh?.toLowerCase() || '';
      const aEn = area.name.en?.toLowerCase() || '';
      if (aZh.includes(term) || aEn.includes(term)) {
        return true;
      }

      // 3. Matches any wild Pokemon inside this location (Reverse lookup)
      for (const enc of area.encounters) {
        if (enc.pid.toString() === term) return true;
        const pZh = enc.name.zh?.toLowerCase() || '';
        const pEn = enc.name.en?.toLowerCase() || '';
        const pJa = enc.name.ja?.toLowerCase() || '';
        if (pZh.includes(term) || pEn.includes(term) || pJa.includes(term)) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const filteredLocations = useMemo(() => {
    return locationList.filter((loc) => {
      // Region filter
      if (selectedRegion && loc.region !== selectedRegion) {
        return false;
      }

      // Category filter
      if (selectedCategory && loc.category !== selectedCategory) {
        return false;
      }

      // Version filter: location must have at least one encounter matching version
      if (selectedVersion) {
        const hasVersion = loc.areas.some((area) =>
          area.encounters.some(
            (e) => e.version === 'both' || e.version === selectedVersion,
          ),
        );
        if (!hasVersion) return false;
      }

      // Search keyword filter
      return keywordMatches(loc, searchKeyword);
    });
  }, [
    locationList,
    selectedRegion,
    selectedCategory,
    selectedVersion,
    searchKeyword,
    keywordMatches,
  ]);

  useEffect(() => {
    document.title = 'Location List - Kanto Pokédex';
  }, []);

  if (loading && locationList.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='space-y-6'>
      <PageHeader />
      <PageViewToggle />

      <SearchFilter searchKeyword={searchKeyword} onSearchChange={handleSearchChange} />

      <LocationFilter
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
      />

      {filteredLocations.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            No locations found matching your search.
          </CardContent>
        </Card>
      ) : (
        <LocationListCard locations={filteredLocations} versionFilter={selectedVersion} />
      )}
    </div>
  );
}
