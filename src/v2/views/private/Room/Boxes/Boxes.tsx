import { TEST_IDS } from '@/test-ids';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import IconButton from '@/v2/components/button/IconButton';
import SelectInput from '@/v2/components/input/SelectInput';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BoxCard from './BoxCard';
import { useBoxesByRoom } from './useBoxesByRoom';

const boxesFilterConfig: ListFilterConfig<BoxType> = {
  searchFields: ['name', 'description_public'],
  orderKeys: ['created', 'last_update', 'name', 'ideas_num'],
};

const Boxes: React.FC = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams<{ room_id: string; phase: `${RoomPhases}` }>();
  const currentPhase = phase ?? '0';
  const { boxes, isLoading, error } = useBoxesByRoom(room_id, currentPhase);
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
              <BoxCard box={box} />
            </li>
          ))}
        </ScrollList>
      )}
    </ListPageLayout>
  );
};

export default Boxes;
