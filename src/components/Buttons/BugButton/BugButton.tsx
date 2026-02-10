import AppIconButton from '@/components/AppIconButton';
import { BugForms } from '@/components/DataForms';
import { addBug, BugArguments } from '@/services/messages';
import { IconButtonProps, Drawer } from '@mui/material';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { versionsRequest } from '@/services/requests-v2';

interface Props extends IconButtonProps {
  target: string;
}

const BugButton = forwardRef<HTMLButtonElement, Props>(({ target, disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  const onSubmit = async (data: BugArguments) => {
    console.log('Submitting bug report with data:', data);
    const versions = await versionsRequest();
    const body = `
---
location: ${location.pathname}
userAgent: ${window.navigator.userAgent}
versions: ${JSON.stringify(versions)}
---
${data.content || ''}
    `;

    const request = await addBug({
      headline: t('scopes.bugs.headline', { var: target }),
      body,
    });
    if (!request.error) onClose();
  };

  const onClose = () => setOpen(false);

  return (
    <>
      <AppIconButton
        ref={ref}
        icon="bug"
        disabled={disabled}
        data-testid="report-bug-button"
        aria-label={t('actions.bugReport')}
        aria-expanded={isOpen}
        {...restOfProps}
        onClick={() => setOpen(true)}
        title={t('actions.bugReport')}
      />
      <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }} data-testid="bug-dialog">
        <BugForms onClose={onClose} onSubmit={onSubmit} />
      </Drawer>
    </>
  );
});

BugButton.displayName = 'BugButton';

export default BugButton;
