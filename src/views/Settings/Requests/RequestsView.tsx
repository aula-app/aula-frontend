import { AppIconButton } from '@/components';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterBar from '../SettingsView/FilterBar';
import RequestsManager from './RequestsManager';

/** * Renders "requests" view
 * url: /settings/requests
 */
const RequestsView = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [openFilter, setOpenFilter] = useState(false);

  const reportFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessages',
      arguments: {
        msg_type: 5,
        status: status,
        extra_where: getFilter(),
      },
    }).then((response) => {
      if (response.success) setReports(response.data);
    });
  const getFilter = () => (!filter.includes('') ? ` AND ${filter[0]} LIKE '%${filter[1]}%'` : '');

  useEffect(() => {
    reportFetch();
  }, [filter, status]);

  return (
    <Stack width="100%" height="100%" p={2} gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{t('views.reports')}</Typography>
        <Stack direction="row" px={2}>
          <AppIconButton icon="filter" onClick={() => setOpenFilter(!openFilter)} />
        </Stack>
      </Stack>
      <FilterBar
        scope={'report'}
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
          reports.map((report) => <RequestsManager report={report} onReload={reportFetch} key={report.id} />)}
      </Stack>
    </Stack>
  );
};

export default RequestsView;
