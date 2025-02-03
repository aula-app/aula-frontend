import { AppIconButton } from '@/components';
import FilterBar from '@/components/FilterBar';
import ReportCard from '@/components/ReportCard';
import ReportCardSkeleton from '@/components/ReportCard/ReportCardSkeleton';
import { getRequests } from '@/services/messages';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Config" view
 * url: /settings/config
 */
const RequestsView = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [openFilter, setOpenFilter] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const response = await getRequests();
    if (response.error) setError(response.error);
    if (!response.error && response.data) setRequests(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
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
        {isLoading && <ReportCardSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {requests.length > 0 &&
          requests.map((report) => <ReportCard report={report} onReload={fetchRequests} key={report.id} />)}
      </Stack>
    </Stack>
  );
};

export default RequestsView;
