import { useCallback, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface UseDraftStorageOptions {
  storageKey: string;
  isNewRecord: boolean;
  selections?: Record<string, any>;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const useDraftStorage = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseDraftStorageOptions
) => {
  const { storageKey, selections, onSubmit, onCancel } = options;
  const { watch, reset, getValues } = form;

  // Capture the initial isNewRecord state and don't let it change
  const [initialIsNewRecord] = useState(options.isNewRecord);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      // Silently handle sessionStorage errors
    }
  }, [storageKey]);

  const loadDraft = useCallback(() => {
    if (!initialIsNewRecord) {
      // Clear draft for existing records
      clearDraft();
      return null;
    }

    try {
      const savedDraft = sessionStorage.getItem(storageKey);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        if (draftData.formData) {
          reset(draftData.formData);
        }
        return draftData.selections || null;
      }
    } catch (error) {
      // Silently handle sessionStorage errors
    }
    return null;
  }, [storageKey, initialIsNewRecord, reset, clearDraft]);

  const saveDraft = useCallback(() => {
    if (!initialIsNewRecord) {
      return;
    }

    try {
      const currentValues = getValues();
      const draftData = {
        formData: currentValues,
        selections: selections || {},
      };
      sessionStorage.setItem(storageKey, JSON.stringify(draftData));
    } catch (error) {
      // Silently handle sessionStorage errors
    }
  }, [storageKey, initialIsNewRecord, getValues, selections]);

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
  }, [watch, initialIsNewRecord, saveDraft, clearDraft, selections]);

  return {
    clearDraft,
    loadDraft,
    handleSubmit,
    handleCancel,
  };
};
