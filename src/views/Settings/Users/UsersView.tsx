import AddRoomButton from '@/components/Buttons/AddRooms/AddRoomsButton';
import { UserForms } from '@/components/DataForms';
import PrintUsers from '@/components/PrintUsers/PrintUsers';
import SelectRoom from '@/components/SelectRoom';
import SettingsView from '@/components/SettingsView';
import { useDataTableState } from '@/hooks';
import { deleteUser, getUsers } from '@/services/users';
import { useAppStore } from '@/store/AppStore';
import { UserType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FILTER = ['displayname', 'username', 'email'] as Array<keyof UserType>;

const COLUMNS = [
  { name: 'displayname', orderId: 5 },
  { name: 'realname', orderId: 6 },
  { name: 'username', orderId: 7 },
  { name: 'email', orderId: 8 },
  { name: 'userlevel', orderId: 9 },
  { name: 'temp_pw', orderId: 11 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof UserType; orderId: number }>;

const UsersView: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [room_id, setRoom] = useState<string>('');
  const [userlevel, setRole] = useState<RoleTypes | 0>(0);

  // Create role options including "All" option
  const roleOptions = [
    { value: 0, label: t('ui.common.all') },
    ...roles.filter((role) => role < 30 || role >= 40).map((r) => ({ value: r, label: t(`roles.${r}`) })),
  ];

  const handleRoleChange = (event: SelectChangeEvent<unknown>) => {
    setRole(Number(event.target.value) as RoleTypes | 0);
  };

  const fetchFn = useCallback(
    async (params: Record<string, unknown>) => {
      return await getUsers({
        ...params,
        room_id,
        userlevel: userlevel === 0 ? undefined : userlevel,
      });
    },
    [room_id, userlevel]
  );

  const dataTableState = useDataTableState<UserType>({
    initialOrderBy: COLUMNS[0].orderId,
    fetchFn,
    deleteFn: deleteUser,
  });

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.users'), '']] });
  }, [dispatch, t]);

  const extraTools = ({ items }: { items: Array<string> }) => (
    <>
      <PrintUsers />
      <AddRoomButton users={items} disabled={items.length === 0} />
    </>
  );

  const extraFilters = (
    <>
      <SelectRoom room={room_id || 'all'} setRoom={setRoom} />
      <FormControl variant="filled" size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="role-filter-label">{t('settings.columns.userlevel')}</InputLabel>
        <Select
          labelId="role-filter-label"
          id="role-filter"
          value={userlevel}
          label={t('settings.columns.userlevel')}
          onChange={handleRoleChange}
          data-testid="role-filter-select"
        >
          {roleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value} data-testid={`role-filter-option-${option.value}`}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <SettingsView
      scope="users"
      columns={COLUMNS}
      filterFields={FILTER}
      dataTableState={dataTableState}
      FormComponent={UserForms as React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>}
      extraTools={extraTools}
      extraFilters={extraFilters}
    />
  );
};

export default UsersView;
