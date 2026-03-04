import { useCallback } from 'react';
import { useUrlParams } from './useUrlParams';

export function useAbilityToggle() {
  const { getBooleanParam, setBooleanParam } = useUrlParams();

  const isShowAbility = getBooleanParam('ability', true); // default to true to match previous behavior

  const toggleAbility = useCallback(() => {
    setBooleanParam('ability', !isShowAbility, true);
  }, [setBooleanParam, isShowAbility]);

  const setShowAbility = useCallback(
    (show: boolean) => {
      setBooleanParam('ability', show, true);
    },
    [setBooleanParam],
  );

  return {
    isShowAbility,
    toggleAbility,
    setShowAbility,
  };
}
