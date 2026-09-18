import { addIdea } from '@/services/ideas';
import { getRoom } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { TEST_IDS } from '@/test-ids';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import BoxCard from '@/v2/components/box/BoxCard';
import { countSettled } from '@/v2/components/box/countSettled';
import Fab from '@/v2/components/button/Fab/Fab';
import IconButton from '@/v2/components/button/IconButton';
import Idea from '@/v2/components/idea/Idea';
import SelectInput from '@/v2/components/input/SelectInput';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { IdeaForm } from '@/v2/forms';
import { useIdeaVotes } from '@/v2/hooks/useIdeaVotes';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useModal } from '@/v2/hooks/useModal';
import { useQuorum } from '@/v2/hooks/useQuorum';
import { useRoomUsers } from '@/v2/hooks/useRoomUsers';
import React, { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useBox } from './useBox';
import { useIdeasByBox } from './useIdeasByBox';

const ideasFilterConfig: ListFilterConfig<IdeaType> = {
  searchFields: ['title', 'content', 'displayname'],
  orderKeys: ['created', 'last_updated', 'displayname', 'title'],
};

const Box: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { room_id, phase, box_id } = useParams<{ room_id: string; phase: string; box_id: string }>();
  const [, dispatch] = useAppStore();
  const { openModal, closeModal } = useModal();
  const { box, isLoading, error, refetch } = useBox(box_id);
  const { ideas, isLoading: isIdeasLoading, error: ideasError, refetch: refetchIdeas } = useIdeasByBox(box_id);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    visibleItems: visibleIdeas,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
    reversed,
    setReversed,
  } = useListFilter(ideas, ideasFilterConfig, `box-ideas-${box_id}`);

  const boxPhase = String(box?.phase_id ?? phase ?? '0');
  const isDecided = Number(boxPhase) >= 30;
  const running = isDecided ? ideas.filter((idea) => idea.approved !== -1) : ideas;
  const listedIdeas = isDecided ? visibleIdeas.filter((idea) => idea.approved !== -1) : visibleIdeas;
  const archivedIdeas = isDecided ? visibleIdeas.filter((idea) => idea.approved === -1) : [];
  const archiveId = useId();

  const settled = countSettled(ideas, Number(boxPhase));

  const votes = useIdeaVotes(running, boxPhase === '30');
  const quorum = useQuorum(boxPhase);
  const users = useRoomUsers(room_id);

  // `:phase` only mirrors the box and goes stale when the box is moved. Everything downstream reads
  // the param (idea styling, the approval badge, the nested idea route), so realign it on the box.
  useEffect(() => {
    if (!box || !room_id) return;
    if (String(box.phase_id) === phase) return;
    navigate(`/room/${room_id}/phase/${box.phase_id}/idea-box/${box_id}`, { replace: true });
  }, [box, room_id, box_id, phase, navigate]);

  useEffect(() => {
    if (!box || !room_id) return;
    getRoom(room_id).then((response) => {
      const roomName = response.data?.room_name || 'aula';
      dispatch({
        action: 'SET_BREADCRUMB',
        breadcrumb: [
          [roomName, `/room/${room_id}/phase/0`],
          [t(`phases.name-${box.phase_id}`), `/room/${room_id}/phase/${box.phase_id}`],
          [box.name, ''],
        ],
      });
    });
  }, [box, room_id, t, dispatch]);

  // Deleting the box we are viewing leaves nothing to show — return to the phase.
  const handleBoxChanged = async () => {
    const updated = await refetch();
    if (!updated) navigate(`/room/${room_id}/phase/${phase}`);
  };

  const canAddIdeas = checkPermissions('ideas', 'create') && Number(box?.phase_id) < 20;
  const addIdeaLabel = t('v2.ui.actions.add', { var: t('v2.scopes.ideas.singular') });

  const handleAddIdea = async (data: any): Promise<boolean> => {
    try {
      setFormError(null);
      const response = await addIdea({
        room_id: data.room || room_id,
        title: data.title,
        content: data.content,
        topic_id: box_id,
      });

      if (response.error) {
        setFormError(response.error);
        return false;
      }

      closeModal();
      refetchIdeas();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.default');
      setFormError(errorMessage);
      console.error('Error adding idea:', error);
      return false;
    }
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      <ListPageLayout
        header={
          <>
            {!isLoading && !error && box && (
              <div className="p-2 pb-0">
                <BoxCard box={box} progress={{ settled, total: ideas.length }} onChanged={handleBoxChanged} />
              </div>
            )}
            {!isLoading && !error && box && (
              <ScopeTitle
                scope="ideas"
                count={listedIdeas.length}
                total={running.length}
                phase={String(box.phase_id)}
                defaultOpen={!!searchQuery}
                onToggle={(open) => !open && setSearchQuery('')}
              >
                <TextInput
                  dense
                  type="search"
                  label={t('v2.ui.actions.search')}
                  startAdornment={<Icon type="search" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-20"
                  data-testid={TEST_IDS.SEARCH_FIELD}
                />
                <SelectInput
                  dense
                  label={t('v2.ui.sort.label')}
                  options={orderOptions}
                  value={orderBy}
                  onChange={setOrderBy}
                  data-testid={TEST_IDS.SORT_SELECT}
                />
                <IconButton
                  dense
                  hint={t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`)}
                  aria-label={t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`)}
                  aria-pressed={reversed}
                  data-testid={TEST_IDS.SORT_DIRECTION_BUTTON}
                  onClick={() => setReversed(!reversed)}
                  className="min-w-6"
                >
                  <Icon type={reversed ? 'sortDesc' : 'sortAsc'} size="1.5em" />
                </IconButton>
              </ScopeTitle>
            )}
          </>
        }
        action={
          !isLoading &&
          !error &&
          box &&
          canAddIdeas && (
            <Fab
              icon={<Icon type="add" />}
              aria-label={addIdeaLabel}
              data-testid={TEST_IDS.ADD_IDEA_BUTTON}
              onClick={() =>
                openModal(
                  addIdeaLabel,
                  <IdeaForm
                    contextRoomId={room_id}
                    contextBoxId={box_id ?? ''}
                    onSubmit={handleAddIdea}
                    onCancel={closeModal}
                    error={formError}
                    onErrorClose={() => setFormError(null)}
                  />
                )
              }
              className="fixed bottom-4 self-center z-10"
            />
          )
        }
      >
        {(isLoading || isIdeasLoading) && (
          <p role="status">
            <span aria-hidden="true">...</span>
            <span className="sr-only">{t('status.loading')}</span>
          </p>
        )}

        {error && (
          <FeedbackState
            image="/img/Paula_unzufrieden.svg"
            alt={t('v2.alt.sad')}
            title={t(`v2.ui.error.${error}.title`)}
            description={t(`v2.ui.error.${error}.description`)}
            data-testid="box-error-state"
          />
        )}

        {!isLoading && !error && box && (
          <>
            {ideasError && (
              <FeedbackState
                image="/img/Paula_unzufrieden.svg"
                alt={t('v2.alt.sad')}
                title={t(`v2.ui.error.${ideasError}.title`)}
                description={t(`v2.ui.error.${ideasError}.description`)}
                data-testid="box-ideas-error-state"
              />
            )}

            {!isIdeasLoading && !ideasError && ideas.length === 0 && (
              <FeedbackState
                image="/img/Paula_schlafend.svg"
                alt={t('v2.alt.sleeping')}
                title={t('v2.ui.error.empty.title')}
                description={t('v2.ui.error.empty.description')}
                data-testid="box-ideas-empty-state"
              />
            )}

            {!isIdeasLoading && !ideasError && ideas.length > 0 && visibleIdeas.length === 0 && (
              <FeedbackState
                image="/img/Paula_zwinkernd.svg"
                alt={t('v2.alt.winking')}
                title={t('v2.ui.error.search.title')}
                description={t('v2.ui.error.search.description')}
                data-testid="box-ideas-no-results-state"
              />
            )}

            {!isIdeasLoading && !ideasError && visibleIdeas.length > 0 && (
              <ScrollList storageKey={`box-ideas-${box_id}`}>
                {listedIdeas.map((idea) => (
                  <li key={idea.hash_id}>
                    <Idea
                      idea={idea}
                      vote={votes[idea.hash_id]}
                      quorum={quorum}
                      users={users}
                      onChanged={refetchIdeas}
                    />
                  </li>
                ))}

                {archivedIdeas.length > 0 && (
                  <li>
                    <section aria-labelledby={archiveId} className="flex flex-col gap-4 pt-4 border-t border-neutral">
                      <h2 id={archiveId} className="text-sm font-semibold text-muted">
                        {t('phases.rejected', { var: archivedIdeas.length })}
                      </h2>
                      <ul className="flex flex-col gap-4">
                        {archivedIdeas.map((idea) => (
                          <li key={idea.hash_id}>
                            <Idea idea={idea} quorum={quorum} users={users} onChanged={refetchIdeas} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  </li>
                )}
              </ScrollList>
            )}
          </>
        )}
      </ListPageLayout>
    </div>
  );
};

export default Box;
