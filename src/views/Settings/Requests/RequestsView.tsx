import { EmptyState } from '@/components';
import FilterBar from '@/components/FilterBar';
import ReportCard from '@/components/ReportCard';
import ReportCardSkeleton from '@/components/ReportCard/ReportCardSkeleton';
import { getRequests } from '@/services/messages';
import { StatusTypes } from '@/types/Generics';
import { MessageType, PossibleFields } from '@/types/Scopes';
import { useAppStore } from '@/store/AppStore';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Config" view
 * url: /settings/config
 */
const RequestsView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<MessageType[]>([]);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[keyof PossibleFields, string]>(['', '']);

  const filterOptions = ['headline', 'body'] as Array<keyof MessageType>;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const response = await getRequests({ status, filter });
    if (response.error) setError(response.error);
    if (!response.error && response.data) setRequests(response.data);
    setLoading(false);
  }, [JSON.stringify(filter), status]);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.requests'), '']] });
    fetchRequests();
  }, [JSON.stringify(filter), status]);

  return (
    <Stack width="100%" height="100%" p={2} gap={2}>
      <FilterBar
        fields={filterOptions}
        scope={'requests'}
        onStatusChange={(newStatus) => setStatus(newStatus)}
        onFilterChange={(newFilter) => setFilter(newFilter)}
      />
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {isLoading && <ReportCardSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading && !error && requests.length === 0 && (
          <EmptyState 
            title={t('ui.empty.requests.title')} 
            description={t('ui.empty.requests.description')} 
          />
        )}
        {requests.length > 0 &&
          requests.map((report) => <ReportCard report={report} onReload={fetchRequests} key={report.hash_id} />)}
      </Stack>
    </Stack>
  );
};

export default RequestsView;
