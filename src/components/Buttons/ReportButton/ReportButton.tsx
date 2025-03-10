import AppIconButton from '@/components/AppIconButton';
import { ReportForms } from '@/components/DataForms';
import { addReport, ReportArguments } from '@/services/messages';
import { Drawer, IconButtonProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface Props extends IconButtonProps {
  target: string;
  link?: string;
}

const ReportButton: React.FC<Props> = ({ target, link, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

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

  return (
    <>
      <AppIconButton icon="report" disabled={disabled} {...restOfProps} onClick={() => setOpen(true)} />
      <Drawer anchor="bottom" open={isOpen} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <ReportForms onClose={onClose} onSubmit={onSubmit} />
      </Drawer>
    </>
  );
};

export default ReportButton;
