import Fab from '@/v2/components/button/Fab/Fab';
import Icon from '@/v2/components/ui/Icon/Icon';
import Idea from '@/v2/components/idea/Idea';
import { useModal } from '@/v2/hooks/useModal';
import { useScrollRestoration } from '@/v2/hooks';
import { useIdeasByRoom } from './useIdeasByRoom';
import { addIdea } from '@/services/ideas';
import { checkPermissions } from '@/utils';
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
  const listRef = useScrollRestoration<HTMLUListElement>(`ideas-${room_id}`, !isLoading && ideas.length > 0);

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
    <div className="flex flex-col h-full gap-1 sm:gap-4">
      <h1 className="flex items-center gap-2 capitalize">
        <Icon type="idea" className="mb-3" />
        <span>{ideas.length}</span>
        <span>{t(`v2.scopes.ideas.${ideas.length === 1 ? 'singular' : 'plural'}`)}</span>
      </h1>

      {!isLoading && checkPermissions('ideas', 'create') && (
        <Fab
          icon={<Icon type="add" />}
          aria-label={addIdeaLabel}
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
          className="fixed bottom-4 self-center"
        />
      )}

      {isLoading && <p>...</p>}
      {error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-16">
          <img src="/img/Paula_unzufrieden.svg" alt={t('v2.alt.sad')} loading="lazy" className="w-32" />
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">{t(`v2.ui.error.${error}.title`)}</h3>
            <p>{t(`v2.ui.error.${error}.description`)}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-16">
          <img src="/img/Paula_schlafend.svg" alt={t('v2.alt.sleeping')} loading="lazy" className="w-32" />
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold">{t('v2.ui.error.empty.title')}</h3>
            <p>{t('v2.ui.error.empty.description')}</p>
          </div>
        </div>
      )}

      {!isLoading && ideas.length > 0 && (
        <ul ref={listRef} className="flex flex-col gap-4 flex-1">
          {ideas.map((idea) => (
            <li key={idea.hash_id}>
              <Idea idea={idea} onChanged={refetch} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ideas;
