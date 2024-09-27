import { AppIconButton } from '@/components';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterBar from '../SettingsView/FilterBar';

/** * Renders "requests" view
 * url: /settings/requests
 */
const SurveysView = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<MessageType[]>([]);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[string, string]>(['', '']);
  const [openFilter, setOpenFilter] = useState(false);

  const requestFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeas',
      arguments: {
        info: 1,
      },
    }).then((response) => {
      if (response.success) setRequests(response.data);
    });
  const getFilter = () => (!filter.includes('') ? ` AND ${filter[0]} LIKE '%${filter[1]}%'` : '');

  useEffect(() => {
    requestFetch();
  }, [filter, status]);

  return (
    <Stack width="100%" height="100%" p={2} gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{t('views.requests')}</Typography>
        <Stack direction="row" px={2}>
          <AppIconButton icon="filter" onClick={() => setOpenFilter(!openFilter)} />
        </Stack>
      </Stack>
      <FilterBar
        scope={'messages'}
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
    </Stack>
  );
};

export default SurveysView;
