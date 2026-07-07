import Fab from '@/v2/components/button/Fab/Fab';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useModal } from '@/v2/hooks/useModal';
import { useIdeasByRoom } from './useIdeasByRoom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IdeaForm } from '@/v2/forms';

const Ideas: React.FC = () => {
  const { t } = useTranslation();
  const { room_id } = useParams<{ room_id: string }>();
  const { openModal, closeModal } = useModal();
  const { ideas, isLoading, error, refetch } = useIdeasByRoom(room_id);

  const addIdeaLabel = t('v2.ui.actions.add', { var: t('v2.scopes.ideas.singular') });

  const handleAddIdea = async (data: any) => {
    try {
      // TODO: Call API to add idea with data
      console.log('Adding idea:', data);
      closeModal();
      refetch();
    } catch (error) {
      console.error('Error adding idea:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1>{t('v2.scopes.ideas.plural')}</h1>

      {!isLoading && (
        <Fab
          icon={<Icon type="add" />}
          aria-label={addIdeaLabel}
          onClick={() =>
            openModal(
              addIdeaLabel,
              <IdeaForm contextRoomId={room_id} contextBoxId="" onSubmit={handleAddIdea} onCancel={closeModal} />
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

      {!isLoading && ideas.length > 0 && (
        <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {ideas.map((idea) => (
            <li key={idea.hash_id} className="p-4 bg-background rounded-lg border border-secondary">
              <h3 className="font-semibold text-foreground">{idea.title}</h3>
              {idea.content && <p className="text-muted text-sm mt-2">{idea.content}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ideas;
