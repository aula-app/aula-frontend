import { AppIcon } from '@/components';
import { DefaultUpdate } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UpdateCard from './UpdateCard';

interface UpdatesResponse {
  votes: DefaultUpdate[];
  comments: DefaultUpdate[];
}

/**
 * Renders "Updates" view
 * url: /updates
 */

const UpdatesView = () => {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<UpdatesResponse>();

  const messageFetch = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getUpdatesByUser',
        arguments: {},
      },
      ['user_id']
    ).then((response) => {
      if (response.success) setUpdates(response.data);
    });

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
          {t('views.updates')}
        </Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {updates &&
        (Object.keys(updates) as Array<keyof UpdatesResponse>).map((update) => (
          <>
            {updates[update].length > 0 && (
              <>
                <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
                  {updates[update].length} {t('texts.new', { var: t(`views.${update}`) })}
                </Typography>

                {updates[update].map((item, key) => (
                  <UpdateCard item={item} icon="voting" variant={update} key={key} />
                ))}
              </>
            )}
          </>
        ))}
    </Stack>
  );
};

export default UpdatesView;
