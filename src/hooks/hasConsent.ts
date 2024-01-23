import { useAppStore } from '@/store';

export function useHasConsent() {
  const [state] = useAppStore();
  let result = state.hasConsent;
  return result;
}

