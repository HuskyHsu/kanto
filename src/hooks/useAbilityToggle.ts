import { useCallback } from 'react';
import { useUrlParams } from './useUrlParams';

export function useAbilityToggle() {
  const { getBooleanParam, setBooleanParam } = useUrlParams();

  const isShowAbility = getBooleanParam('ability', false);

  const toggleAbility = useCallback(() => {
    setBooleanParam('ability', !isShowAbility, false);
  }, [setBooleanParam, isShowAbility]);

  const setShowAbility = useCallback(
    (show: boolean) => {
      setBooleanParam('ability', show, false);
    },
    [setBooleanParam],
  );

  return {
    isShowAbility,
    toggleAbility,
    setShowAbility,
  };
}
