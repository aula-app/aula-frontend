import { useCallback, useEffect, useState } from 'react';
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
  const { storageKey, onSubmit, onCancel } = options;
  const { watch, reset, getValues } = form;
  
  // Capture the initial isNewRecord state and don't let it change
  const [initialIsNewRecord] = useState(options.isNewRecord);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear draft from sessionStorage:', error);
    }
  }, [storageKey]);

  const loadDraft = useCallback(() => {
    if (!initialIsNewRecord) {
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
  }, [storageKey, initialIsNewRecord, reset, clearDraft]);

  const saveDraft = useCallback(() => {
    if (!initialIsNewRecord) {
      console.log('Skipping draft save - not a new record');
      return;
    }

    try {
      const currentValues = getValues();
      sessionStorage.setItem(storageKey, JSON.stringify(currentValues));
      console.log('Draft saved for key:', storageKey);
    } catch (error) {
      console.warn('Failed to save draft to sessionStorage:', error);
    }
  }, [storageKey, initialIsNewRecord, getValues]);

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
    if (!initialIsNewRecord) {
      // Ensure no draft watching for existing records
      clearDraft();
      return;
    }

    const subscription = watch(() => {
      // Double-check initialIsNewRecord before saving
      if (initialIsNewRecord) {
        saveDraft();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, initialIsNewRecord, saveDraft, clearDraft]);

  return {
    clearDraft,
    handleSubmit,
    handleCancel,
  };
};
