import { AppIcon } from '@/components';
import UserForms from '@/components/Data/DataForms/UserForms';
import DataTable from '@/components/Data/DataTable';
import DataTableSkeleton from '@/components/Data/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/Data/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import SelectRole from '@/components/SelectRole';
import SelectRoom from '@/components/SelectRoom';
import {
  addUser,
  AddUserArguments,
  deleteUser,
  editUser,
  EditUserArguments,
  getUsers,
  UserArguments,
} from '@/services/users';
import { StatusTypes } from '@/types/Generics';
import { UserType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import { getDataLimit } from '@/utils';
import { Button, Drawer, Typography } from '@mui/material';
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

  const [room_id, setRoom] = useState<string | undefined>();
  const [userlevel, setRole] = useState<RoleTypes | 0 | undefined>();
  const [edit, setEdit] = useState<string | boolean>(false); // false = update dialog closed ;true = new idea; string = item hash_id;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const response = await getUsers({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      room_id,
      userlevel,
      search_field,
      search_text,
      status,
    });
    if (response.error) setError(response.error);
    else {
      setUsers(response.data || []);
      setTotalUsers(response.count as number);
    }
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby, room_id, userlevel]);

  const onSubmit = (data: UserArguments) => {
    if (!edit) return;
    typeof edit === 'boolean' ? newUser(data as AddUserArguments) : updateUser(data as EditUserArguments);
  };

  const newUser = async (data: AddUserArguments) => {
    const request = await addUser({
      userlevel: String(data.userlevel || 20),
      displayname: data.displayname,
      realname: data.realname,
      username: data.username,
      email: data.email,
      about_me: data.about_me,
      status: data.status || 1,
    });
    if (!request.error) onClose();
  };

  const updateUser = async (data: EditUserArguments) => {
    const user = users.find((user) => user.hash_id === edit);
    if (!user || !user.hash_id) return;
    const request = await editUser({
      user_id: user.hash_id,
      userlevel: data.userlevel,
      displayname: data.displayname,
      realname: data.realname,
      username: data.username,
      email: data.email,
      about_me: data.about_me,
      status: data.status,
    });
    if (!request.error) onClose();
  };

  const deleteUsers = (items: Array<string>) =>
    items.map(async (user) => {
      const request = await deleteUser(user);
      if (!request.error) onClose();
    });

  const addToRoom = (items: Array<string>) =>
    items.map(async (user) => {
      const request = await deleteUser(user);
      if (!request.error) onClose();
    });

  const addToGroup = (items: Array<string>) =>
    items.map(async (user) => {
      const request = await deleteUser(user);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const extraTools = ({ items }: { items: Array<string> }) => (
    <>
      <Button variant="outlined" color="secondary" onClick={() => addToRoom(items)}>
        <AppIcon icon="room" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.rooms.name'),
        })}
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => addToGroup(items)}>
        <AppIcon icon="group" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.groups.name'),
        })}
      </Button>
    </>
  );

  return (
    <Stack width="100%" height="100%" py={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="users"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        >
          <SelectRoom room={room_id || ''} setRoom={setRoom} />
          <SelectRole role={userlevel} setRole={setRole} />
        </FilterBar>
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {isLoading && <DataTableSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading && users.length > 0 && (
          <DataTable
            scope="users"
            columns={COLUMNS}
            rows={users}
            orderAsc={asc}
            orderBy={orderby}
            setAsc={setAsc}
            setLimit={setLimit}
            setOrderby={setOrderby}
            setEdit={setEdit}
            setDelete={deleteUsers}
            extraTools={extraTools}
          />
        )}
        <PaginationBar pages={Math.ceil(totalUsers / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <UserForms
          onClose={onClose}
          onSubmit={onSubmit}
          defaultValues={
            typeof edit !== 'boolean' ? (users.find((user) => user.hash_id === edit) as UserArguments) : undefined
          }
        />
      </Drawer>
    </Stack>
  );
};

export default UsersView;
