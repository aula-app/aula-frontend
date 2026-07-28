import { RoomPhases } from '@/types/SettingsTypes';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BoxCard from './BoxCard';
import { useBoxesByRoom } from './useBoxesByRoom';

const Boxes: React.FC = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams<{ room_id: string; phase: `${RoomPhases}` }>();
  const currentPhase = phase ?? '0';
  const { boxes, isLoading, error } = useBoxesByRoom(room_id, currentPhase);

  return (
    <ListPageLayout header={<ScopeTitle scope="boxes" count={boxes.length} total={boxes.length} />}>
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
          data-testid="boxes-error-state"
        />
      )}

      {!isLoading && !error && boxes.length === 0 && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.ui.error.empty.title')}
          description={t('v2.ui.error.empty.description')}
          data-testid="boxes-empty-state"
        />
      )}

      {!isLoading && boxes.length > 0 && (
        <ScrollList storageKey={`boxes-${room_id}-${currentPhase}`}>
          {boxes.map((box) => (
            <li key={box.hash_id}>
              <BoxCard box={box} />
            </li>
          ))}
        </ScrollList>
      )}
    </ListPageLayout>
  );
};

export default Boxes;
