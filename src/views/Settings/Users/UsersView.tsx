import AddRoomButton from '@/components/Buttons/AddRooms/AddRoomsButton';
import { UserForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import PrintUsers from '@/components/PrintUsers/PrintUsers';
import SelectRole from '@/components/SelectRole';
import SelectRoom from '@/components/SelectRoom';
import { deleteUser, getUsers } from '@/services/users';
import { useAppStore } from '@/store/AppStore';
import { StatusTypes } from '@/types/Generics';
import { UserType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Users" view
 * url: /settings/users
 */

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

  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);
  const [room_id, setRoom] = useState<string>('');
  const [userlevel, setRole] = useState<RoleTypes | 0>(0);

  const [edit, setEdit] = useState<UserType | boolean>(false); // false = update dialog closed ;true = new idea; UserType = user to edit;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const response = await getUsers({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      room_id,
      userlevel: userlevel === 0 ? undefined : userlevel,
      search_field,
      search_text,
      status,
    });
    if (response.error) setError(response.error);
    setUsers(response.data || []);
    setTotalUsers(response.count as number);
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby, room_id, userlevel]);

  const deleteUsers = (items: Array<string>) =>
    items.map(async (user) => {
      const request = await deleteUser(user);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchUsers();
  };

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
  }, [search_field, search_text, status, userlevel, room_id]);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.users'), '']] });
    fetchUsers();
  }, [fetchUsers]);

  const extraTools = ({ items }: { items: Array<string> }) => (
    <>
      <PrintUsers />
      <AddRoomButton users={items} disabled={items.length === 0} />
      {/* <AddGroupButton users={items} /> */}
    </>
  );

  return (
    <Stack flex={1} overflow="hidden" pt={2}>
      <Stack px={2}>
        <FilterBar
          fields={FILTER}
          scope="users"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        >
          <SelectRoom room={room_id || 'all'} setRoom={setRoom} />
          <SelectRole userRole={userlevel} onChange={(role) => setRole(role)} allowAll variant="filled" size="small" />
        </FilterBar>
      </Stack>
      <Stack flex={1} overflow="hidden">
        <DataTable
          scope="users"
          columns={COLUMNS}
          rows={users}
          orderAsc={asc}
          orderBy={orderby}
          setAsc={setAsc}
          setLimit={setLimit}
          setOrderby={setOrderby}
          setEdit={(user) => setEdit(user as UserType | boolean)}
          setDelete={deleteUsers}
          extraTools={extraTools}
          isLoading={isLoading}
        />
      </Stack>
      <PaginationBar pages={Math.ceil(totalUsers / limit)} setPage={(page) => setOffset(page * limit)} />
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <UserForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default UsersView;
