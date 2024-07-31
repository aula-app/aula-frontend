import { AppButton, AppIcon, AppLink } from '@/components';
import { ObjectPropByName } from '@/types/Generics';
import { MessageType, ReportBodyType, ReportType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Divider, Stack, Typography } from '@mui/material';
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
      {report && (
        <Stack flex={1}>
          <Typography fontWeight={700} align="center" py={2}>
            {report.headline}
          </Typography>
          <Divider />
          <Stack my={2}>
            {(Object.keys(report.body.data) as Array<keyof ReportBodyType['data']>).map((data) => (
              <Typography mt={1} key={data}>
                {data}:{' '}
                {data === 'location' ? (
                  <AppLink to={report.body.data[data]}>{report.body.data[data]}</AppLink>
                ) : (
                  report.body.data[data]
                )}
              </Typography>
            ))}
          </Stack>
          <Divider />
          <Stack mt={2} flex={1}>
            <Typography>{report.body.content}</Typography>
          </Stack>
        </Stack>
      )}
      <Stack direction="row" justifyContent="end">
        <AppButton color="error" onClick={() => deleteMessage()}>
          {t('generics.discard')}
        </AppButton>
      </Stack>
    </Stack>
  );
};

export default ReportView;
