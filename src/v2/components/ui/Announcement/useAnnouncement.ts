import { getConsents, giveConsent, MessageConsentType } from '@/services/consent';
import { useToast } from '@/v2/hooks/useToast';
import { useCallback, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const useAnnouncement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<MessageConsentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayed, setDisplayed] = useState<MessageConsentType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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
    if (announcements.length > 0) {
      setDisplayed(announcements[0]);
      setIsChecked(false);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setDisplayed(null);
    }
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
