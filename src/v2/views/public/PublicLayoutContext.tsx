import { createContext, useContext, useLayoutEffect } from 'react';

interface PublicLayoutContextValue {
  heroHidden: boolean;
  setHeroHidden: (hidden: boolean) => void;
}

export const PublicLayoutContext = createContext<PublicLayoutContextValue | undefined>(undefined);

const usePublicLayout = (): PublicLayoutContextValue => {
  const context = useContext(PublicLayoutContext);

  if (!context) {
    throw new Error('usePublicLayout must be used within a PublicLayout');
  }

  return context;
};

/**
 * Hides the Aula hero illustration in the public layout for as long as the calling view is mounted.
 * Used by views that render their own illustration (e.g. Offline, NotFound).
 */
export const useHidePublicHero = (): void => {
  const { setHeroHidden } = usePublicLayout();

  useLayoutEffect(() => {
    setHeroHidden(true);
    return () => setHeroHidden(false);
  }, [setHeroHidden]);
};
