import { AppButton, AppIcon, AppLink } from '@/components';
import { ObjectPropByName } from '@/types/Generics';
import { MessageType, ReportBodyType, ReportType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "Report" view
 * url: /report
 */

const ReportView = () => {
  const params = useParams();
  const [report, setReport] = useState<ReportType>();

  const reportFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessageBaseData',
      arguments: {
        message_id: params['message_id'],
      },
    }).then((response) => {
      if (!response.success) return;
      if (response.data.body) response.data.body = JSON.parse(response.data.body);
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
            {report.headline}
          </Typography>
          <Divider />
          <Stack my={2}>
            {report.headline.substring(0, 7) !== 'Account' && (
              <Stack direction="row">
                <AppIcon icon="link" sx={{ mr: 0.5 }} />
                <AppLink to={report.body.data.location}>{report.body.data.location}</AppLink>
              </Stack>
            )}
            {Object.keys(report.body.data).map((data) => (
              <Typography mt={1} key={data}>
                {data}: {report.body.data[data]}
              </Typography>
            ))}
          </Stack>
          <Divider />
          <Stack mt={2} flex={1}>
            <Typography>{report.body.content}</Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ReportView;
