import { AppIconButton } from '@/components';
import ReportCard from '@/components/ReportCard';
import { useAppStore } from '@/store';
import { StatusTypes } from '@/types/Generics';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterBar from '../SettingsView/FilterBar';

/** * Renders "Config" view
 * url: /settings/config
 */
const ReportsView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [reports, setReports] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [openFilter, setOpenFilter] = useState(false);

  const reportFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessages',
      arguments: {
        msg_type: 4,
        status: status,
        extra_where: getFilter(),
      },
    }).then((response) => {
      response.success
        ? setReports(response.data)
        : dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
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
          reports.map((report) => <ReportCard report={report} onReload={reportFetch} key={report.id} />)}
      </Stack>
    </Stack>
  );
};

export default ReportsView;
