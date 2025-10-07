import { RoomForms } from '@/components/DataForms';
import SettingsView from '@/components/SettingsView';
import { useDataTableState } from '@/hooks';
import { deleteRoom, getRooms } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { RoomType } from '@/types/Scopes';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FILTER = ['room_name', 'description_public'] as Array<keyof RoomType>;

const COLUMNS = [
  { name: 'room_name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof RoomType; orderId: number }>;

const RoomsView: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const fetchFn = useCallback(async (params: Record<string, unknown>) => {
    return await getRooms({
      ...params,
      type: 0,
    });
  }, []);

  const dataTableState = useDataTableState<RoomType>({
    initialOrderBy: COLUMNS[0].orderId,
    fetchFn,
    deleteFn: deleteRoom,
  });

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.rooms'), '']] });
  }, [dispatch, t]);

  return (
    <SettingsView
      scope="rooms"
      columns={COLUMNS}
      filterFields={FILTER}
      dataTableState={dataTableState}
      FormComponent={RoomForms as React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>}
    />
  );
};

export default RoomsView;
