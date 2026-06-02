import { getRuntimeConfig } from '@/config';
import { getConsents, giveConsent, MessageConsentType } from '@/services/consent';
import Button from '@/v2/components/button/Button';
import Dialog from '@/v2/components/ui/Dialog';
import { useToast } from '@/v2/hooks/useToast';
import { useCallback, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import IconButton from '../../button/IconButton';
import Icon from '../Icon';

const Announcement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<MessageConsentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const bodyId = useId();

  const getData = useCallback(async () => {
    const response = await getConsents();
    if (response.error) return;
    setAnnouncements(response.data ?? []);
  }, []);

  useEffect(() => {
    getData();
  }, [location, getData]);

  const handleAction = async (text_id: number, consent_value: 1 | -1) => {
    setIsSubmitting(true);
    setStatusMessage(t('ui.announcement.submitting'));
    try {
      const response = await giveConsent(text_id, consent_value);
      if (response.error) {
        toast.error(response.error);
        setStatusMessage('');
        return;
      }
      await getData();
      setStatusMessage('');
    } catch {
      toast.error(t('errors.default'));
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = announcements[0];

  if (!current) return null;
  const showDismiss = current.user_needs_to_consent !== 2;
  const showAgree = current.user_needs_to_consent !== 0;

  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
      <Dialog
        key={current.id}
        open
        title={t('ui.announcement.title')}
        describedBy={bodyId}
        role={showDismiss ? 'dialog' : 'alertdialog'}
      >
        <div className="flex items-center justify-between px-2">
          <img
            src={`${getRuntimeConfig().BASENAME}img/Paula_Moderation.svg`}
            alt={t('v2.alt.microphone')}
            className="w-8 pt-4 ml-4"
          />
          {showDismiss ? (
            <IconButton
              onClick={() => handleAction(current.id, -1)}
              disabled={isSubmitting}
              aria-label={t('ui.announcement.close')}
            >
              <Icon type="close" />
            </IconButton>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 px-6 py-4">
          <h3>{current.headline}</h3>
          <p id={bodyId} className="text-sm">{current.body}</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3">
          {showDismiss && (
            <Button
              text
              color="secondary"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              onClick={() => handleAction(current.id, -1)}
              className="mr-auto"
              data-testid="button-consent-dismiss"
            >
              {t('ui.common.dismiss')}
            </Button>
          )}
          {showAgree && (
            <Button
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              onClick={() => handleAction(current.id, 1)}
              data-testid="button-consent-agree"
            >
              {current.consent_text || t('actions.agree')}
            </Button>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default Announcement;
