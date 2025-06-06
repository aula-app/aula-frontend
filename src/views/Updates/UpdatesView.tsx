import { AppIcon, EmptyState } from '@/components';
import { useAppStore } from '@/store/AppStore';
import { getUpdates, UpdateResponse } from '@/services/dashboard';
import { IconButton, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UpdateCard from './UpdateCard';

/**
 * Renders "Updates" view
 * url: /updates
 */

const UpdatesView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updates, setUpdates] = useState<UpdateResponse>({
    votes: [],
    comments: [],
  });

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    const response = await getUpdates(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setUpdates(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.units.updates'), '']] });
    fetchUpdates();
  }, []);

  return (
    <Stack flex={1} gap={1} p={2} sx={{ overflowY: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h1">{t('scopes.updates.plural')}</Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {!isLoading && updates.votes.length === 0 && updates.comments.length === 0 && (
        <EmptyState title={t('ui.empty.updates.title')} description={t('ui.empty.updates.description')} />
      )}
      {updates &&
        (Object.keys(updates) as Array<keyof UpdateResponse>).map((update) => {
          return updates[update].length === 0 ? null : (
            <>
              <Typography variant="h1" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
                {updates[update].length} {t('actions.add', { var: t(`scopes.${update}.name`) })}
              </Typography>

              {updates[update].map((item, key) => (
                <UpdateCard item={item} icon="voting" variant={update} key={key} />
              ))}
            </>
          );
        })}
    </Stack>
  );
};

export default UpdatesView;
