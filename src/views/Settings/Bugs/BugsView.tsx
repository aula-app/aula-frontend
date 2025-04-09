import FilterBar from '@/components/FilterBar';
import { StatusTypes } from '@/types/Generics';
import { MessageType, PossibleFields } from '@/types/Scopes';
import { useAppStore } from '@/store/AppStore';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBugs } from '@/services/messages';
import ReportCardSkeleton from '@/components/ReportCard/ReportCardSkeleton';
import ReportCard from '@/components/ReportCard';

/** * Renders "Config" view
 * url: /settings/config
 */
const BugsView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bugs, setBugs] = useState<MessageType[]>([]);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[keyof PossibleFields, string]>(['', '']);

  const filterOptions = ['headline', 'body', 'creator_id'] as Array<keyof MessageType>;

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    const response = await getBugs({ status, filter });
    if (response.error) setError(response.error);
    if (!response.error && response.data) setBugs(response.data);
    setLoading(false);
  }, [JSON.stringify(filter), status]);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.bugs'), '']] });
    fetchBugs();
  }, [JSON.stringify(filter), status]);

  return (
    <Stack width="100%" height="100%" p={2} gap={2}>
      <FilterBar
        fields={filterOptions}
        scope={'bugs'}
        onStatusChange={(newStatus) => setStatus(newStatus)}
        onFilterChange={(newFilter) => setFilter(newFilter)}
      />
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {isLoading && <ReportCardSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {bugs.length > 0 && bugs.map((bug) => <ReportCard report={bug} onReload={fetchBugs} key={bug.id} />)}
      </Stack>
    </Stack>
  );
};

export default BugsView;
