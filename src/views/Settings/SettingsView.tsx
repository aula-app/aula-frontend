import ItemsTable from '@/components/ItemsTable';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import UsersView from './Users';
import { useParams } from 'react-router-dom';
import GroupsView from './Groups';
import IdeasView from './Ideas';
import RoomsView from './Rooms';
import { SettingsType } from '@/types/SettingsTypes';
import { NotFoundView } from '..';

/** * Renders default "Settings" view
 * urls: /settings/users, /settings/rooms, /settings/groups, /settings/ideas
 */
const SettingsView = () => {
  const pages = {
    groups: <GroupsView />,
    ideas: <IdeasView />,
    rooms: <RoomsView />,
    users: <UsersView />,
  };

  const { setting_name } = useParams();
  const isSettings = (param: any): param is SettingsType => Object.keys(pages).includes(param);

  return isSettings(setting_name) ? (
    <Stack direction="column" height="100%">
      <Typography variant="h4" sx={{ p: 2, pb: 0, textTransform: 'capitalize' }}>
        {setting_name}
      </Typography>
      <ItemsTable table={setting_name} />
    </Stack>
  ) : (
    <NotFoundView />
  );
};

export default SettingsView;
