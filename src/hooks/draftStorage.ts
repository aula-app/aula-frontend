import { useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface UseDraftStorageOptions {
  storageKey: string;
  isNewRecord: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const useDraftStorage = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseDraftStorageOptions
) => {
  const { storageKey, isNewRecord, onSubmit, onCancel } = options;
  const { watch, reset, getValues } = form;

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear draft from sessionStorage:', error);
    }
  }, [storageKey]);

  const loadDraft = useCallback(() => {
    if (!isNewRecord) {
      // Clear draft for existing records
      clearDraft();
      return;
    }

    try {
      const savedDraft = sessionStorage.getItem(storageKey);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        reset(draftData);
      }
    } catch (error) {
      console.warn('Failed to load draft from sessionStorage:', error);
    }
  }, [storageKey, isNewRecord, reset, clearDraft]);

  const saveDraft = useCallback(() => {
    if (!isNewRecord) return;

    try {
      const currentValues = getValues();
      sessionStorage.setItem(storageKey, JSON.stringify(currentValues));
    } catch (error) {
      console.warn('Failed to save draft to sessionStorage:', error);
    }
  }, [storageKey, isNewRecord, getValues]);

  const handleSubmit = useCallback(() => {
    clearDraft();
    onSubmit?.();
  }, [clearDraft, onSubmit]);

  const handleCancel = useCallback(() => {
    clearDraft();
    onCancel?.();
  }, [clearDraft, onCancel]);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  useEffect(() => {
    if (!isNewRecord) {
      // Ensure no draft watching for existing records
      clearDraft();
      return;
    }

    const subscription = watch(() => {
      saveDraft();
    });

    return () => subscription.unsubscribe();
  }, [watch, isNewRecord, saveDraft, clearDraft]);

  return {
    clearDraft,
    handleSubmit,
    handleCancel,
  };
};