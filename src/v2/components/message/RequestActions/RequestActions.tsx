import { TEST_IDS } from '@/test-ids';
import Button from '@/v2/components/button/Button';
import Dialog from '@/v2/components/ui/Dialog';
import Icon from '@/v2/components/ui/Icon';
import { twMerge } from 'tailwind-merge';
import { RequestType } from './useRequestActions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RequestActionsProps {
  /** Account deletion gets a destructive confirmation. */
  type: RequestType;
  pending: boolean;
  onConfirm: () => Promise<void>;
  onReject: () => Promise<void>;
}

const RequestActions = ({ type, pending, onConfirm, onReject }: RequestActionsProps) => {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const isDestructive = type === 'deleteAccount';

  const handleConfirm = async () => {
    await onConfirm();
    setConfirming(false);
  };

  return (
    <>
      <div className="flex justify-between gap-2">
        <Button color="error" onClick={onReject} disabled={pending} data-testid={TEST_IDS.REJECT_REQUEST_BUTTON}>
          {t('v2.scopes.messages.reject')}
        </Button>
        <Button
          color="success"
          aria-haspopup="dialog"
          onClick={() => setConfirming(true)}
          disabled={pending}
          data-testid={TEST_IDS.CONFIRM_REQUEST_BUTTON}
        >
          {t('v2.ui.button.confirm')}
        </Button>
      </div>
      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        role="alertdialog"
        title={t('requests.confirmationTitle')}
        data-testid={TEST_IDS.CONFIRM_REQUEST_DIALOG}
      >
        <div className="flex flex-col gap-4 p-4">
          <h3 className={twMerge('flex items-center gap-2 text-lg font-semibold', isDestructive && 'text-error-fg')}>
            <Icon type={isDestructive ? 'alert' : 'request'} size="1.2em" aria-hidden="true" />
            {t('requests.confirmationTitle')}
          </h3>
          <p>{t('requests.confirmation')}</p>
          <div className="flex justify-end gap-2">
            <Button
              text
              onClick={() => setConfirming(false)}
              disabled={pending}
              data-testid={TEST_IDS.CONFIRM_REQUEST_CANCEL}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              color={isDestructive ? 'error' : 'success'}
              onClick={handleConfirm}
              disabled={pending}
              data-testid={TEST_IDS.CONFIRM_REQUEST_ACTION}
            >
              {t('v2.ui.button.confirm')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RequestActions;
