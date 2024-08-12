import ReportCard from '@/components/ReportCard';
import { ReportType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Config" view
 * url: /settings/config
 */
const ReportsView = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ReportType[]>([]);

  const reportFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessages',
      arguments: {},
    }).then((response) => {
      if (!response.success) return;
      if (response.data) {
        response.data.map((r: any) => {
          try {
            r.body = JSON.parse(r.body);
            return r;
          } catch (error) {
            return r;
          }
        });
        setReports(response.data);
      }
    });

  useEffect(() => {
    reportFetch();
  }, []);

  return (
    <Stack width="100%" height="100%" p={2}>
      <Typography variant="h4" mb={2}>
        {t('views.reports')}
      </Typography>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {reports.length > 0 &&
          reports.map((report) => <ReportCard headline={report.headline} body={report.body} key={report.id} />)}
      </Stack>
    </Stack>
  );
};

export default ReportsView;
