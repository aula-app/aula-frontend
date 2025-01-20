import { AppIcon } from '@/components';
import EditData from '@/components/Data/EditData';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { IdeaType } from '@/types/Scopes';
import { CustomFieldsType } from '@/types/SettingsTypes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Fab, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface RouteParams extends Record<string, string | undefined> {
  room_id: string;
}

/**
 * WildIdeas component displays a list of ideas for a specific room.
 * Users with appropriate permissions can add new ideas.
 *
 * @component
 * @url /room/:room_id/ideas
 */
const WildIdeas = () => {
  const { t } = useTranslation();
  const { room_id } = useParams<RouteParams>();
  const [add, setAdd] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [fields, setFields] = useState<CustomFieldsType>({
    custom_field1: null,
    custom_field2: null,
  });

  const ideasFetch = useCallback(async () => {
    setLoading(true);
    const response = await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id },
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch ideas');
    }

    setIdeas(response.data as IdeaType[]);
    getFields();
    setLoading(false);
  }, [room_id]);

  async function getFields() {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (response.success)
        setFields({
          custom_field1: response.data.custom_field1_name,
          custom_field2: response.data.custom_field2_name,
        });
    });
  }

  const handleCloseAdd = useCallback(() => {
    ideasFetch();
    setAdd(false);
  }, [ideasFetch]);

  useEffect(() => {
    ideasFetch();
  }, [ideasFetch]);

  const fabStyles = {
    position: 'fixed',
    bottom: 40,
    zIndex: 1000,
  };

  return (
    <Stack alignItems="center" width="100%" px={1} spacing={2}>
      {isLoading ? (
        <IdeaBubbleSkeleton />
      ) : ideas.length === 0 ? (
        <Typography>{t('errors.noData')}</Typography>
      ) : (
        ideas.map((idea) => (
          <IdeaBubble
            idea={idea}
            extraFields={fields}
            onReload={ideasFetch}
            key={idea.id}
            comments={idea.sum_comments}
            to={`idea/${idea.hash_id}`}
          />
        ))
      )}
      {checkPermissions(20) && (
        <>
          <Fab aria-label="add idea" color="primary" sx={fabStyles} onClick={() => setAdd(true)}>
            <AppIcon icon="idea" />
          </Fab>
          <EditData scope="ideas" isOpen={add} onClose={handleCloseAdd} otherData={{ room_id }} />
        </>
      )}
    </Stack>
  );
};

export default WildIdeas;
