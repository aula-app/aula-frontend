import { getRuntimeConfig } from '@/config';
import { getConsents, giveConsent, MessageConsentType } from '@/services/consent';
import Button from '@/v2/components/button/Button';
import Dialog from '@/v2/components/ui/Dialog';
import { useToast } from '@/v2/hooks/useToast';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import IconButton from '../../button/IconButton';
import Icon from '../Icon';

const TRANSITION_MS = 300;

const Announcement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<MessageConsentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [displayed, setDisplayed] = useState<MessageConsentType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  if (!displayed) return null;

  const showDismiss = displayed.user_needs_to_consent !== 2;
  const showAgree = displayed.user_needs_to_consent !== 0;

  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
      <Dialog
        key={displayed.id}
        open={isOpen}
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
              onClick={() => handleAction(displayed.id, -1)}
              disabled={isSubmitting}
              aria-label={t('ui.announcement.close')}
            >
              <Icon type="close" />
            </IconButton>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 px-6 py-4">
          <h3>{displayed.headline}</h3>
          <p id={bodyId} className="text-sm">{displayed.body}</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3">
          {showDismiss && (
            <Button
              text
              color="secondary"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              onClick={() => handleAction(displayed.id, -1)}
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
              onClick={() => handleAction(displayed.id, 1)}
              data-testid="button-consent-agree"
            >
              {displayed.consent_text || t('actions.agree')}
            </Button>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default Announcement;
