import { AppButton, AppIcon, AppLink } from '@/components';
import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "Report" view
 * url: /report
 */

const ReportView = () => {
  const params = useParams();
  const [report, setReport] = useState<MessageType>();

  const rxCommonMarkLink = /(\[([^\]]+)])\(([^)]+)\)/g;

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

  useEffect(() => {
    reportFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {report && (
        <Stack flex={1}>
          <Typography fontWeight={700} align="center" py={2}>
            {report.headline.replace(rxCommonMarkLink, '$2')}:
          </Typography>
          {report.headline.substring(0, 7) !== 'Account' && (
            <Stack direction="row" justifyContent="center">
              <AppIcon icon="link" sx={{ mr: 1 }} />
              <AppLink to={String(report.headline.match(/\(([^)]+)\)/g)).replace(/[{()}]/g, '')} pb={2}>
                {String(report.headline.match(/\(([^)]+)\)/g)).replace(/[{()}]/g, '')}
              </AppLink>
            </Stack>
          )}
          <Stack flex={1} alignItems="center">
            <Typography>{report.body}</Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ReportView;
