import { addIdea } from '@/services/ideas';
import { TEST_IDS } from '@/test-ids';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import Fab from '@/v2/components/button/Fab/Fab';
import Idea from '@/v2/components/idea/Idea';
import SelectInput from '@/v2/components/input/SelectInput';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { IdeaForm } from '@/v2/forms';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useModal } from '@/v2/hooks/useModal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useIdeasByRoom } from './useIdeasByRoom';
import { IconButton } from '@mui/material';

const ideasFilterConfig: ListFilterConfig<IdeaType> = {
  searchFields: ['title', 'content', 'displayname'],
  orderKeys: ['created', 'last_updated', 'displayname', 'title'],
};

const Ideas: React.FC = () => {
  const { t } = useTranslation();
  const { room_id } = useParams<{ room_id: string }>();
  const { openModal, closeModal } = useModal();
  const { ideas, isLoading, error, refetch } = useIdeasByRoom(room_id);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    visibleItems: visibleIdeas,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
  } = useListFilter(ideas, ideasFilterConfig);

  const addIdeaLabel = t('v2.ui.actions.add', { var: t('v2.scopes.ideas.singular') });

  const handleAddIdea = async (data: any): Promise<boolean> => {
    try {
      setFormError(null);
      const response = await addIdea({
        room_id: data.room || room_id,
        title: data.title,
        content: data.content,
        topic_id: data.box,
      });

      if (response.error) {
        setFormError(response.error);
        return false;
      }

      closeModal();
      refetch();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.default');
      setFormError(errorMessage);
      console.error('Error adding idea:', error);
      return false;
    }
  };

  return (
    <ListPageLayout
      header={
        <ScopeTitle scope="ideas" count={visibleIdeas.length} onToggle={(open) => !open && setSearchQuery('')}>
          <TextInput
            dense
            type="search"
            label={t('v2.ui.actions.search')}
            startAdornment={<Icon type="search" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <SelectInput
            dense
            label={t('v2.ui.sort.label')}
            options={orderOptions}
            value={orderBy}
            onChange={setOrderBy}
          />
          <IconButton>
            <Icon type="sortUp" />
          </IconButton>
        </ScopeTitle>
      }
      action={
        !isLoading &&
        checkPermissions('ideas', 'create') && (
          <Fab
            icon={<Icon type="add" />}
            aria-label={addIdeaLabel}
            data-testid={TEST_IDS.ADD_IDEA_BUTTON}
            onClick={() =>
              openModal(
                addIdeaLabel,
                <IdeaForm
                  contextRoomId={room_id}
                  contextBoxId=""
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
      {isLoading && (
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
          data-testid="ideas-error-state"
        />
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.ui.error.empty.title')}
          description={t('v2.ui.error.empty.description')}
          data-testid="ideas-empty-state"
        />
      )}

      {!isLoading && !error && ideas.length > 0 && visibleIdeas.length === 0 && (
        <FeedbackState
          image="/img/Paula_zwinkernd.svg"
          alt={t('v2.alt.winking')}
          title={t('v2.ui.error.search.title')}
          description={t('v2.ui.error.search.description')}
          data-testid="ideas-no-results-state"
        />
      )}

      {!isLoading && visibleIdeas.length > 0 && (
        <ScrollList storageKey={`ideas-${room_id}`}>
          {visibleIdeas.map((idea) => (
            <li key={idea.hash_id}>
              <Idea idea={idea} onChanged={refetch} />
            </li>
          ))}
        </ScrollList>
      )}
    </ListPageLayout>
  );
};

export default Ideas;
