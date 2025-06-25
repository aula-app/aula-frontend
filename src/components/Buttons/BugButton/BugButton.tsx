import AppIconButton from '@/components/AppIconButton';
import { BugForms } from '@/components/DataForms';
import { AccessibleModal } from '@/components/AccessibleDialog';
import { addBug, BugArguments } from '@/services/messages';
import { IconButtonProps } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface Props extends IconButtonProps {
  target: string;
}

const BugButton: React.FC<Props> = ({ target, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        ref={buttonRef}
        icon="bug"
        disabled={disabled}
        aria-label={t('actions.bugReport')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        {...restOfProps}
        onClick={() => setOpen(true)}
        title={t('actions.bugReport')}
      />
      <AccessibleModal
        open={isOpen}
        onClose={onClose}
        title={t('actions.bugReport')}
        showCloseButton={true}
        maxWidth="100%"
        testId="bug-dialog"
        finalFocusRef={buttonRef}
      >
        <BugForms onClose={onClose} onSubmit={onSubmit} />
      </AccessibleModal>
    </>
  );
};

export default BugButton;