import { getRuntimeConfig } from '@/config';
import Button from '@/v2/components/button/Button';
import Checkbox from '@/v2/components/input/Checkbox';
import Dialog from '@/v2/components/ui/Dialog';
import { useTranslation } from 'react-i18next';
import { useAnnouncement } from './useAnnouncement';

const Announcement = () => {
  const { t } = useTranslation();
  const { displayed, isOpen, isChecked, setIsChecked, isSubmitting, handleAction, bodyId } = useAnnouncement();

  if (!displayed) return null;

  const consentLevel = displayed.user_needs_to_consent;

  return (
    <Dialog
      key={displayed.id}
      open={isOpen}
      title={t('ui.announcement.title')}
      describedBy={bodyId}
      role={consentLevel !== 2 ? 'dialog' : 'alertdialog'}
      className="overflow-visible"
    >
      <img
        src={`${getRuntimeConfig().BASENAME}img/Paula_Moderation.svg`}
        alt={t('v2.alt.microphone')}
        className="w-16 absolute top-0 left-0 -translate-x-1/3 -translate-y-1/2"
      />
      <div className="flex flex-col gap-4 px-6 pt-2 pb-4">
        <h2>{displayed.headline}</h2>
        <p id={bodyId} className="text-sm">
          {displayed.body}
        </p>
      </div>
      {consentLevel > 0 && (
        <div className="px-6 py-3">
          <Checkbox
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            id={`consent-box-${displayed.id}`}
            label={displayed.consent_text || t('v2.ui.actions.agree')}
            checked={isChecked}
            required={consentLevel === 2}
            helperText={consentLevel === 2 ? t('v2.ui.announcement.helper') : undefined}
            disabled={isSubmitting}
            data-testid="checkbox-consent"
            onChange={(e) => {
              setIsChecked(e.target.checked);
              if (consentLevel !== 2) handleAction(displayed.id, -1);
            }}
          />
        </div>
      )}
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <Button
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={consentLevel === 0}
          type="button"
          disabled={isSubmitting || (consentLevel === 2 && !isChecked)}
          aria-busy={isSubmitting}
          onClick={() => handleAction(displayed.id, 1)}
          data-testid="button-consent-agree"
        >
          {t('v2.ui.announcement.button')}
        </Button>
      </div>
    </Dialog>
  );
};

export default Announcement;
