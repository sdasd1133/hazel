import { useEffect, useState } from 'react';

/**
 * 클라이언트에서만 true를 반환하는 hook
 * hydration 미스매치를 방지하기 위해 사용
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
