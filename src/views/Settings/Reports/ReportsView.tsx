import { AppIconButton } from '@/components';
import FilterBar from '@/components/FilterBar';
import ReportCard from '@/components/ReportCard';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { databaseRequest, RequestObject } from '@/utils';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Config" view
 * url: /settings/config
 */
const ReportsView = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [openFilter, setOpenFilter] = useState(false);

  const reportFetch = async () => {
    const requestData = {
      model: 'Message',
      method: 'getMessages',
      arguments: {
        msg_type: 4,
        status: status,
      },
    } as RequestObject;

    if (!filter.includes('')) {
      requestData['arguments']['search_field'] = filter[0];
      requestData['arguments']['search_text'] = filter[1];
    }

    await databaseRequest(requestData).then((response) => {
      if (response.success) setReports(response.data);
    });
  };

  useEffect(() => {
    reportFetch();
  }, [filter, status]);

  return (
    <Stack width="100%" height="100%" p={2} gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{t('scopes.reports.plural')}</Typography>
        <Stack direction="row" px={2}>
          <AppIconButton icon="filter" onClick={() => setOpenFilter(!openFilter)} />
        </Stack>
      </Stack>
      <FilterBar
        scope={'reports'}
        filter={filter}
        statusOptions={[
          { label: 'status.active', value: 1 },
          { label: 'status.archived', value: 3 },
        ]}
        status={status}
        setFilter={setFilter}
        setStatus={setStatus}
        isOpen={openFilter}
      />
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {reports.length > 0 &&
          reports.map((report) => <ReportCard report={report} onReload={reportFetch} key={report.id} />)}
      </Stack>
    </Stack>
  );
};

export default ReportsView;
