import { BoxForms } from '@/components/DataForms';
import SelectRoom from '@/components/SelectRoom';
import SettingsView from '@/components/SettingsView';
import { useDataTableState } from '@/hooks';
import { BoxArguments, deleteBox, getBoxes } from '@/services/boxes';
import { useAppStore } from '@/store/AppStore';
import { BoxType } from '@/types/Scopes';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FILTER = ['name', 'description_public', 'description_internal'] as Array<keyof BoxType>;

const COLUMNS = [
  { name: 'name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'description_internal', orderId: 7 },
  { name: 'room_hash_id', orderId: 8 },
  { name: 'phase_id', orderId: 9 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof BoxArguments; orderId: number }>;

const BoxesView: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [room_id, setRoom] = useState<string>('');

  const fetchFn = useCallback(
    async (params: Record<string, unknown>) => {
      return await getBoxes({
        ...params,
        room_id,
      });
    },
    [room_id]
  );

  const dataTableState = useDataTableState<BoxType>({
    initialOrderBy: COLUMNS[0].orderId,
    fetchFn,
    deleteFn: deleteBox,
  });

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.boxes'), '']] });
  }, [dispatch, t]);

  const extraFilters = <SelectRoom room={room_id} setRoom={setRoom} />;

  return (
    <SettingsView
      scope="boxes"
      columns={COLUMNS}
      filterFields={FILTER}
      dataTableState={dataTableState}
      FormComponent={BoxForms as React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>}
      extraFilters={extraFilters}
    />
  );
};

export default BoxesView;
