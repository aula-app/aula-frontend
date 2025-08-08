import AppIconButton from '@/components/AppIconButton';
import { BugForms } from '@/components/DataForms';
import { addBug, BugArguments } from '@/services/messages';
import { IconButtonProps, Drawer } from '@mui/material';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface Props extends IconButtonProps {
  target: string;
}

const BugButton = forwardRef<HTMLButtonElement, Props>(({ target, disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  const onSubmit = async (data: BugArguments) => {
    const body = `
---
location: ${location.pathname}
userAgent: ${window.navigator.userAgent}
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
        aria-label={t('actions.bugReport')}
        aria-expanded={isOpen}
        {...restOfProps}
        onClick={() => setOpen(true)}
        title={t('actions.bugReport')}
      />
      <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <BugForms onClose={onClose} onSubmit={onSubmit} />
      </Drawer>
    </>
  );
});

BugButton.displayName = 'BugButton';

export default BugButton;
