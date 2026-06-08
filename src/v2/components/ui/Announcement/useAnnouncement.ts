import { getConsents, giveConsent, MessageConsentType } from '@/services/consent';
import { useToast } from '@/v2/hooks/useToast';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const TRANSITION_MS = 300;

export const useAnnouncement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<MessageConsentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayed, setDisplayed] = useState<MessageConsentType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyId = useId();

  const getData = useCallback(async () => {
    const response = await getConsents();
    if (response.error) return;
    setAnnouncements(response.data ?? []);
  }, []);

  useEffect(() => {
    getData();
  }, [location, getData]);

  useEffect(() => {
    const first = announcements[0] ?? null;
    if (first) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setDisplayed(first);
      setIsChecked(false);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      closeTimer.current = setTimeout(() => setDisplayed(null), TRANSITION_MS);
    }
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [announcements]);

  const handleAction = async (text_id: number, consent_value: 1 | -1) => {
    setIsSubmitting(true);
    try {
      const response = await giveConsent(text_id, consent_value);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      await getData();
    } catch {
      toast.error(t('errors.default'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { displayed, isOpen, isChecked, setIsChecked, isSubmitting, handleAction, bodyId };
};
