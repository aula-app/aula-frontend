import AppIconButton from '@/components/AppIconButton';
import { ReportForms } from '@/components/DataForms';
import { AccessibleModal } from '@/components/AccessibleDialog';
import { addReport, ReportArguments } from '@/services/messages';
import { IconButtonProps } from '@mui/material';
import { forwardRef, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface Props extends IconButtonProps {
  target: string;
  link?: string;
}

const ReportButton = forwardRef<HTMLButtonElement, Props>(({ target, link, disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const internalRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async (data: ReportArguments) => {
    const body = `
---
claim: ${t(`forms.report.${data.report}`)}
location: ${link || location.pathname}
---
${data.content || ''}
    `;

    const request = await addReport({
      headline: t('scopes.reports.headline', { var: target }),
      body,
    });
    if (!request.error) onClose();
  };

  const onClose = () => setOpen(false);

  // Helper function to handle both forwarded ref and internal ref
  const setButtonRef = (node: HTMLButtonElement | null) => {
    // Set internal ref
    (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;

    // Forward the ref to parent
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }
  };

  return (
    <>
      <AppIconButton
        data-testid="report-button"
        ref={setButtonRef}
        icon="report"
        title={t('tooltips.report')}
        disabled={disabled}
        aria-label={t('actions.contentReport')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        {...restOfProps}
        onClick={() => setOpen(true)}
      />
      <AccessibleModal
        open={isOpen}
        onClose={onClose}
        title={t('actions.contentReport')}
        showCloseButton={true}
        maxWidth="100%"
        testId="report-dialog"
        finalFocusRef={internalRef}
      >
        <ReportForms onClose={onClose} onSubmit={onSubmit} />
      </AccessibleModal>
    </>
  );
});

ReportButton.displayName = 'ReportButton';

export default ReportButton;
