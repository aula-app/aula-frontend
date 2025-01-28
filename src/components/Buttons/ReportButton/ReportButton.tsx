import AppIconButton from '@/components/AppIconButton';
import { ReportForms } from '@/components/Data/DataForms';
import { addReport } from '@/services/messages';
import { Drawer, IconButtonProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends IconButtonProps {
  target: string;
}

export interface ReportFormData {
  report: string;
  content: string;
}

const ReportButton: React.FC<Props> = ({ target, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const onSubmit = async (data: ReportFormData) => {
    const body = `
      ***
      ${t(`forms.report.${data.report}`)}
      ***
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
