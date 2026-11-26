import { editBox } from '@/services/boxes';
import { TEST_IDS } from '@/test-ids';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import Button from '@/v2/components/button/Button';
import Dialog from '@/v2/components/ui/Dialog';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

const PHASE_STEP = 10;

interface PhaseAdvanceProps {
  box: BoxType;
  /** Called once the box has moved, so the surrounding list refetches. */
  onAdvanced?: () => void;
  /** Corner radius is the caller's, since the band closes the box card. */
  className?: string;
}

/** Offer to move a box whose phase has run its course into the next one. */
const PhaseAdvance = ({ box, onAdvanced, className }: PhaseAdvanceProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const next = (Number(box.phase_id) + PHASE_STEP) as RoomPhases;
  const color = phases[`${next}`] ?? 'wild';
  const name = t(`phases.name-${next}`);

  const advance = async () => {
    setPending(true);
    try {
      const response = await editBox({
        topic_id: box.hash_id,
        room_id: box.room_hash_id,
        phase_id: next,
        name: box.name,
        description_public: box.description_public,
      });

      if (response.error) {
        toast.error(response.error || t('errors.failed'));
        return;
      }

      setOpen(false);
      onAdvanced?.();
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <div
        className={twMerge(
          'flex flex-wrap items-center justify-between gap-2 px-3 py-1.5',
          `bg-${color}-light text-${color}-fg`,
          className
        )}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Icon type={color} size="1.25rem" aria-hidden="true" />
          {t('v2.scopes.boxes.phaseReady', { var: name })}
        </span>
        <Button
          aria-haspopup="dialog"
          data-testid={TEST_IDS.ADVANCE_PHASE_BUTTON}
          onClick={() => setOpen(true)}
          className="py-1 text-sm"
        >
          {t('v2.scopes.boxes.advance')}
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} role="alertdialog" title={t('v2.ui.dialog.phase.title')}>
        <div className="flex flex-col gap-4 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Icon type={color} size="1.2em" aria-hidden="true" /> {t('v2.ui.dialog.phase.title')}
          </h3>
          <p className="whitespace-pre-line">{t('v2.ui.dialog.phase.description', { box: box.name, phase: name })}</p>
          <div className="flex justify-end gap-2">
            <Button text onClick={() => setOpen(false)} disabled={pending} data-testid={TEST_IDS.ADVANCE_PHASE_CANCEL}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={advance} disabled={pending} data-testid={TEST_IDS.ADVANCE_PHASE_CONFIRM}>
              {t('v2.scopes.boxes.advance')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PhaseAdvance;
