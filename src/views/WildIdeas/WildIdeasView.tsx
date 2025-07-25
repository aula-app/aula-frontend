import { AppIcon, EmptyState } from '@/components';
import { IdeaForms } from '@/components/DataForms';
import { IdeaBubble } from '@/components/Idea';
import IdeaBubbleSkeleton from '@/components/Idea/IdeaBubble/IdeaBubbleSkeleton';
import { useAppStore } from '@/store/AppStore';
import { getRoom } from '@/services/rooms';
import { deleteIdea, getIdeasByRoom } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Drawer, Fab, Stack, Typography } from '@mui/material';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SortButton from '@/components/Buttons/SortButton';

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
  const { phase, room_id } = useParams<RouteParams>();
  const [appState, dispatch] = useAppStore();

  const IDEAS_SORT_OPTIONS = [
    { label: t('settings.columns.created'), value: 'created' },
    { label: t('settings.columns.sum_likes'), value: 'sum_likes' },
    { label: t('settings.columns.sum_comments'), value: 'sum_comments' },
  ] as Array<{ label: string; value: keyof IdeaType }>;

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [edit, setEdit] = useState<IdeaType | boolean>(false); // false = update dialog closed ;true = new idea; IdeaType = edit idea;

  const [orderby, setOrderby] = useState<keyof IdeaType>(IDEAS_SORT_OPTIONS[0].value);
  const [asc, setAsc] = useState(false);

  const getRoomName = (id: string) => {
    return getRoom(id).then((response) => {
      if (response.error || !response.data) return;
      let roomName = response.data.room_name;
      return roomName;
    });
  };

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    setLoading(true);
    const response = await getIdeasByRoom(room_id);
    if (response.error) setError(response.error);
    if (!response.error) setIdeas(response.data || []);
    setLoading(false);

    let roomName = await getRoomName(room_id);
    roomName = roomName ? roomName : 'aula';
    dispatch({
      action: 'SET_BREADCRUMB',
      breadcrumb: [
        [roomName, `/room/${room_id}/phase/0`],
        [t(`phases.name-${phase}`), `/room/${room_id}/phase/${phase}`],
      ],
    });
  }, [room_id]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const onEdit = (idea: IdeaType) => {
    setEdit(idea);
  };

  const onDelete = async (id: string) => {
    const request = await deleteIdea(id);
    if (!request.error) onClose();
  };

  const onClose = () => {
    setEdit(false);
    fetchIdeas();
  };

  const saveScroll = (evt: SyntheticEvent) => {
    dispatch({
      action: 'SAVE_SCROLL',
      lastScroll: (evt.target as HTMLElement).scrollTop,
      lastIdeaList: 'wild-ideas',
    });
  };

  useEffect(() => {
    let ideasList = document.getElementById('wild-ideas-list');
    if (!!ideasList) {
      if (appState.lastIdeaList == 'wild-ideas') {
        ideasList.scrollTop = appState.lastScroll;
      } else
        dispatch({
          action: 'SAVE_SCROLL',
          lastScroll: 0,
          lastIdeaList: 'wild-ideas',
        });
    }
  }, [ideas]);

  return (
    <Stack
      id="wild-ideas-list"
      style={{ overflowY: 'scroll' }}
      onScroll={saveScroll}
      alignItems="center"
      flex={1}
      spacing={2}
    >
      {isLoading && <IdeaBubbleSkeleton />}
      {!isLoading &&
        (ideas.length === 0 ? (
          <EmptyState title={t('ui.empty.ideas.title')} description={t('ui.empty.ideas.description')} />
        ) : (
          <Stack width="100%">
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" pb={2}>
              <Stack direction="row" alignItems="center" gap={1}>
                <AppIcon icon="idea" />
                <Typography variant="h2">{t('ui.navigation.ideas')}</Typography>
              </Stack>
              <SortButton
                options={IDEAS_SORT_OPTIONS}
                onSelect={(orderby: string) => {
                  setOrderby(orderby as keyof IdeaType);
                }}
                onReorder={(asc: boolean) => {
                  setAsc(asc);
                }}
              ></SortButton>
            </Stack>
            <Stack width="100%" gap={2}>
              {ideas
                .slice()
                .sort((a, b) => {
                  const valueA = a[orderby];
                  const valueB = b[orderby];
                  if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return asc ? valueA - valueB : valueB - valueA;
                  }
                  return asc
                    ? String(valueA).localeCompare(String(valueB))
                    : String(valueB).localeCompare(String(valueA));
                })
                .map((idea) => (
                  <IdeaBubble
                    key={idea.id}
                    idea={idea}
                    to={`idea/${idea.hash_id}`}
                    onEdit={() => onEdit(idea)}
                    onDelete={() => onDelete(idea.hash_id)}
                  />
                ))}
            </Stack>
          </Stack>
        ))}
      {checkPermissions('ideas', 'create') && room_id && (
        <Fab
          aria-label="add idea"
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 40,
            zIndex: 1000,
          }}
          onClick={() => setEdit(true)}
        >
          <AppIcon icon="idea" />
        </Fab>
      )}
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default WildIdeas;
