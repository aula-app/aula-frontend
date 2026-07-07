import Fab from '@/v2/components/button/Fab/Fab';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useModal } from '@/v2/hooks/useModal';
import { useIdeasByRoom } from './useIdeasByRoom';
import { IdeaForms } from '@/components/DataForms';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const Ideas: React.FC = () => {
  const { t } = useTranslation();
  const { room_id } = useParams<{ room_id: string }>();
  const { openModal, closeModal } = useModal();
  const { ideas, isLoading, error, refetch } = useIdeasByRoom(room_id);

  const addIdeaLabel = t('v2.ui.actions.add', { var: t('v2.scopes.ideas.singular') });

  return (
    <div className="flex flex-col h-full">
      <h1>{t('v2.scopes.ideas.plural')}</h1>

      {!isLoading && !error && (
        <Fab
          icon={<Icon type="add" />}
          aria-label={addIdeaLabel}
          onClick={() =>
            openModal(
              addIdeaLabel,
              <IdeaForms
                onClose={() => {
                  closeModal();
                  refetch();
                }}
              />
            )
          }
          className="fixed bottom-4 self-center"
        />
      )}

      {isLoading && <p>{t('ui.common.loading')}</p>}
      {error && <p className="text-error">{error}</p>}
      {!isLoading && ideas.length === 0 && <p className="text-muted">{t('ui.common.noResults')}</p>}

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
