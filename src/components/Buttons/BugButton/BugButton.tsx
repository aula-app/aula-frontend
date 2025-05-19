import AppIconButton from '@/components/AppIconButton';
import { BugForms } from '@/components/DataForms';
import { addBug, BugArguments } from '@/services/messages';
import { Drawer, IconButtonProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  target: string;
}

const BugButton: React.FC<Props> = ({ target, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
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
        icon="bug"
        disabled={disabled}
        aria-label={t('actions.bugReport')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        {...restOfProps}
        onClick={() => setOpen(true)}
        title={t('actions.bugReport')}
      />
      <Drawer 
        anchor="bottom" 
        open={isOpen} 
        onClose={onClose} 
        sx={{ overflowY: 'auto' }}
        role="dialog"
        aria-modal="true"
        aria-label={t('actions.bugReport')}
      >
        <BugForms onClose={onClose} onSubmit={onSubmit} />
      </Drawer>
    </>
  );
};

export default BugButton;
