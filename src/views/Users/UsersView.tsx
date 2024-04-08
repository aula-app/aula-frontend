import ItemsTable from '@/components/ItemsTable';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';

/** * Renders "Rooms" view
 * url: /
 */
const RoomsView = () => {
  return (
    <Stack direction="column" height="100%">
      <Typography variant="h4" sx={{ p: 2, pb: 0 }}>
        Users
      </Typography>
      <ItemsTable table="users" />
    </Stack>
  );
};

export default RoomsView;
