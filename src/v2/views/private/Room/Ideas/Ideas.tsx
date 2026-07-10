import Fab from '@/v2/components/button/Fab/Fab';
import Icon from '@/v2/components/ui/Icon/Icon';
import Idea from '@/v2/components/idea/Idea';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import { useModal } from '@/v2/hooks/useModal';
import { useIdeasByRoom } from './useIdeasByRoom';
import { addIdea } from '@/services/ideas';
import { checkPermissions } from '@/utils';
import { TEST_IDS } from '@/test-ids';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IdeaForm } from '@/v2/forms';

const Ideas: React.FC = () => {
  const { t } = useTranslation();
  const { room_id } = useParams<{ room_id: string }>();
  const { openModal, closeModal } = useModal();
  const { ideas, isLoading, error, refetch } = useIdeasByRoom(room_id);
  const [formError, setFormError] = useState<string | null>(null);

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
        <ScopeTitle
          icon={<Icon type="idea" className="mb-3" />}
          count={ideas.length}
          label={t(`v2.scopes.ideas.${ideas.length === 1 ? 'singular' : 'plural'}`)}
        />
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
        />
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.ui.error.empty.title')}
          description={t('v2.ui.error.empty.description')}
        />
      )}

      {!isLoading && ideas.length > 0 && (
        <ScrollList storageKey={`ideas-${room_id}`}>
          {ideas.map((idea) => (
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
