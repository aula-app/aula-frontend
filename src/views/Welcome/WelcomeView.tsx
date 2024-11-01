import { RoomCard } from '@/components/RoomCard';
import RoomCardSkeleton from '@/components/RoomCard/RoomCardSkeleton';
import { RoomType } from '@/types/Scopes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashBoard from '../DashBoard';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [showDashboard, setDashboard] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const roomsFetch = async () =>
    await databaseRequest(
      {
        model: 'Room',
        method: checkPermissions(40) ? 'getRooms' : 'getRoomsByUser',
        arguments: {
          offset: 0,
          limit: 0,
        },
      },
      checkPermissions(40) ? [] : ['user_id']
    ).then((response) => {
      setLoading(false);
      if (!response.success || !response.data) return;
      setRooms(response.data as RoomType[]);
    });

  const handleScroll = () => {
    setDashboard(false);
  };

  useEffect(() => {
    roomsFetch();
  }, []);

  return (
    <Stack height="100%" sx={{ p: { md: 1 } }}>
      <DashBoard show={showDashboard} />
      <Stack
        flexGrow={1}
        position="relative"
        onScroll={handleScroll}
        sx={{
          px: 2,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
        }}
      >
        <Typography
          variant="h4"
          className="noSpace"
          sx={{
            pt: 2,
            scrollSnapAlign: 'start',
            transition: 'all .5s ease-in-out',
          }}
        >
          {t('views.rooms')}
        </Typography>
        <Grid container flex={1} spacing={2}>
          {isLoading && <RoomCardSkeleton />}
          {rooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
