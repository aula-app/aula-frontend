import { addBox } from '@/services/boxes';
import { TEST_IDS } from '@/test-ids';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import Fab from '@/v2/components/button/Fab/Fab';
import IconButton from '@/v2/components/button/IconButton';
import SelectInput from '@/v2/components/input/SelectInput';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { BoxForm } from '@/v2/forms';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useModal } from '@/v2/hooks/useModal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BoxCard from '@/v2/components/box/BoxCard';
import { useBoxesByRoom } from './useBoxesByRoom';

const boxesFilterConfig: ListFilterConfig<BoxType> = {
  searchFields: ['name', 'description_public'],
  orderKeys: ['created', 'last_update', 'name', 'ideas_num'],
};

const Boxes: React.FC = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams<{ room_id: string; phase: `${RoomPhases}` }>();
  const currentPhase = phase ?? '0';
  const { openModal, closeModal } = useModal();
  const { boxes, isLoading, error, refetch } = useBoxesByRoom(room_id, currentPhase);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    visibleItems: visibleBoxes,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
    reversed,
    setReversed,
  } = useListFilter(boxes, boxesFilterConfig, `boxes-${room_id}-${currentPhase}`);

  const addBoxLabel = t('v2.ui.actions.add', { var: t('v2.scopes.boxes.singular') });

  const handleAddBox = async (data: any): Promise<boolean> => {
    try {
      setFormError(null);
      const response = await addBox({
        room_id: data.room || room_id,
        phase_id: Number(data.phase_id) as RoomPhases,
        name: data.name,
        description_public: data.description_public,
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
      console.error('Error adding box:', error);
      return false;
    }
  };

  return (
    <ListPageLayout
      header={
        <ScopeTitle
          scope="boxes"
          count={visibleBoxes.length}
          total={boxes.length}
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
      }
      action={
        !isLoading &&
        checkPermissions('boxes', 'create') && (
          <Fab
            icon={<Icon type="add" />}
            aria-label={addBoxLabel}
            data-testid={TEST_IDS.ADD_BOX_BUTTON}
            onClick={() =>
              openModal(
                addBoxLabel,
                <BoxForm
                  contextRoomId={room_id}
                  contextPhaseId={currentPhase}
                  onSubmit={handleAddBox}
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

      {!isLoading && !error && boxes.length > 0 && visibleBoxes.length === 0 && (
        <FeedbackState
          image="/img/Paula_zwinkernd.svg"
          alt={t('v2.alt.winking')}
          title={t('v2.ui.error.search.title')}
          description={t('v2.ui.error.search.description')}
          data-testid="boxes-no-results-state"
        />
      )}

      {!isLoading && visibleBoxes.length > 0 && (
        <ScrollList storageKey={`boxes-${room_id}-${currentPhase}`}>
          {visibleBoxes.map((box) => (
            <li key={box.hash_id}>
              <BoxCard box={box} onChanged={refetch} />
            </li>
          ))}
        </ScrollList>
      )}
    </ListPageLayout>
  );
};

export default Boxes;
