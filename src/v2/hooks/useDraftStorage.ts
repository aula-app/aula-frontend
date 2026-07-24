import { useCallback, useEffect } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface UseDraftStorageOptions {
  /** Unique key the draft is stored under in sessionStorage. */
  storageKey: string;
  /**
   * Whether draft persistence is active. Pass `!isEditing` so drafts are only
   * kept for new records — editing an existing entry never writes a draft.
   */
  enabled: boolean;
}

interface DraftPayload<T> {
  formData: T;
}

/**
 * Persists an in-progress form to sessionStorage so a draft survives closing
 * and reopening the form on the same session (e.g. a modal that gets dismissed
 * accidentally). All values live in react-hook-form, so the whole draft is
 * just the form state — there is nothing to track outside of it.
 *
 * The draft is loaded once on mount, saved on every change, and cleared via the
 * returned `clearDraft` (call it on successful submit and on cancel).
 */
export const useDraftStorage = <T extends FieldValues>(
  form: UseFormReturn<T>,
  { storageKey, enabled }: UseDraftStorageOptions
) => {
  const { watch, reset, getValues } = form;

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // sessionStorage can be unavailable (private mode, quota) — draft is best-effort.
    }
  }, [storageKey]);

  const loadDraft = useCallback(() => {
    if (!enabled) {
      clearDraft();
      return;
    }
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (!saved) return;
      const draft = JSON.parse(saved) as DraftPayload<T>;
      if (draft.formData) reset(draft.formData);
    } catch {
      // Ignore malformed/unavailable drafts and start from the form defaults.
    }
  }, [storageKey, enabled, reset, clearDraft]);

  const saveDraft = useCallback(() => {
    if (!enabled) return;
    try {
      const payload: DraftPayload<T> = { formData: getValues() };
      sessionStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Best-effort — a failed write just means no draft is kept.
    }
  }, [storageKey, enabled, getValues]);

  // Restore any existing draft once, before the user starts typing.
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Mirror every change into storage while drafting.
  useEffect(() => {
    if (!enabled) {
      clearDraft();
      return;
    }
    const subscription = watch(() => saveDraft());
    return () => subscription.unsubscribe();
  }, [enabled, watch, saveDraft, clearDraft]);

  return { clearDraft };
};
