import { TEST_IDS } from '@/test-ids';
import { RoomType } from '@/types/Scopes';
import IconButton from '@/v2/components/button/IconButton';
import SelectInput from '@/v2/components/input/SelectInput';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import RoomCard from '@/v2/components/room/RoomCard';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useRoomPhaseCounts } from '@/v2/hooks/useRoomPhaseCounts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRooms } from './useRooms';

const roomsFilterConfig: ListFilterConfig<RoomType> = {
  searchFields: ['room_name'],
  orderKeys: ['order_importance', 'room_name', 'created', 'last_update'],
};

const Rooms: React.FC = () => {
  const { t } = useTranslation();
  const { rooms, isLoading, error } = useRooms();
  const {
    visibleItems: visibleRooms,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
    reversed,
    setReversed,
  } = useListFilter(rooms, roomsFilterConfig, 'rooms');

  const counts = useRoomPhaseCounts(rooms.map((room) => room.hash_id));

  return (
    <ListPageLayout
      header={
        <ScopeTitle
          scope="rooms"
          count={visibleRooms.length}
          total={rooms.length}
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
          data-testid="rooms-error-state"
        />
      )}

      {!isLoading && !error && rooms.length === 0 && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.ui.error.empty.title')}
          description={t('v2.ui.error.empty.description')}
          data-testid="rooms-empty-state"
        />
      )}

      {!isLoading && !error && rooms.length > 0 && visibleRooms.length === 0 && (
        <FeedbackState
          image="/img/Paula_zwinkernd.svg"
          alt={t('v2.alt.winking')}
          title={t('v2.ui.error.search.title')}
          description={t('v2.ui.error.search.description')}
          data-testid="rooms-no-results-state"
        />
      )}

      {!isLoading && visibleRooms.length > 0 && (
        <ScrollList
          storageKey="rooms"
          className="grid grid-cols-1 content-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visibleRooms.map((room) => (
            <li key={room.hash_id} data-testid="room-card-item">
              <RoomCard room={room} counts={counts[room.hash_id]} />
            </li>
          ))}
        </ScrollList>
      )}
    </ListPageLayout>
  );
};

export default Rooms;
