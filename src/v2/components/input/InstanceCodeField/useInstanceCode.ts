import { validateAndSaveInstanceCode } from '@/services/instance';
import { getRuntimeConfig } from '@/config';
import { localStorageGet } from '@/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MIN_CODE_LENGTH = 3;
const MAX_CODE_LENGTH = 8;

export const useInstanceCode = () => {
  const { t } = useTranslation();
  const { IS_MULTI } = getRuntimeConfig();

  const stored = IS_MULTI ? (localStorageGet('code', false) as string | false) : 'SINGLE';
  const hasStored = typeof stored === 'string' && stored.length > 0;

  const [instanceCode, setInstanceCode] = useState(hasStored ? stored : '');
  const [isEditing, setIsEditing] = useState(!hasStored);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setError(undefined);
  };

  /**
   * Call this at the top of any form's onSubmit before running its own logic.
   * Returns true if the code is ready (already stored or just validated+saved).
   * Returns false if validation failed — sets an error on the field.
   */
  const validateCode = async (): Promise<boolean> => {
    if (!IS_MULTI) return true;
    if (!isEditing) return true;

    const trimmed = instanceCode.trim();

    if (!trimmed) {
      setError(t('v2.form.validation.required'));
      return false;
    }
    if (trimmed.length < MIN_CODE_LENGTH) {
      setError(t('v2.form.validation.minLength', { var: MIN_CODE_LENGTH }));
      return false;
    }
    if (trimmed.length > MAX_CODE_LENGTH) {
      setError(t('v2.form.validation.maxLength', { var: MAX_CODE_LENGTH }));
      return false;
    }

    setIsLoading(true);
    try {
      const isValid = await validateAndSaveInstanceCode(trimmed);
      if (isValid) {
        setIsEditing(false);
        setError(undefined);
        return true;
      }
      setError(t('errors.default'));
      return false;
    } catch {
      setError(t('instance.error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    instanceCode,
    setInstanceCode,
    isEditing,
    startEditing,
    error,
    isLoading,
    validateCode,
    /** False when IS_MULTI=false — callers should not render InstanceCodeField */
    showField: IS_MULTI,
  };
};
