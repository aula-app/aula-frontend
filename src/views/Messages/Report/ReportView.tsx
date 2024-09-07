import { AppButton } from '@/components';
import ReportCard from '@/components/ReportCard';
import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Stack } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Renders "Report" view
 * url: /report
 */

const ReportView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<MessageType>();

  const reportFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessageBaseData',
      arguments: {
        message_id: params['message_id'],
      },
    }).then((response) => {
      if (!response.success) return;
      setReport(response.data);
    });

  const deleteMessage = async () =>
    await databaseRequest(
      {
        model: 'Message',
        method: 'setMessageStatus',
        arguments: {
          message_id: params['message_id'],
          status: 4,
        },
      },
      ['updater_id']
    ).then(() => navigate('/messages'));

  useEffect(() => {
    reportFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {report && <ReportCard headline={report.headline} body={report.body} />}
      <Stack direction="row" justifyContent="end">
        <AppButton color="error" onClick={() => deleteMessage()}>
          {t('generics.discard')}
        </AppButton>
      </Stack>
    </Stack>
  );
};

export default ReportView;
