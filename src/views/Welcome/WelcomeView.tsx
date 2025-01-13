import { RoomCard } from '@/components/RoomCard';
import RoomCardSkeleton from '@/components/RoomCard/RoomCardSkeleton';
import { RoomType } from '@/types/Scopes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashBoard from '../DashBoard';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const roomsFetch = async () => {
    // Check if user has Super Moderator (40) access to view all rooms
    const hasSuperModAccess = checkPermissions(40);

    const response = await databaseRequest(
      {
        model: 'Room',
        method: hasSuperModAccess ? 'getRooms' : 'getRoomsByUser',
        arguments: {
          offset: 0,
          limit: 0,
        },
      },
      hasSuperModAccess ? [] : ['user_id']
    );
    setLoading(false);
    if (!response.success || !response.data) {
      setError(true);
      return;
    }
    setError(false);
    setRooms(response.data as RoomType[]);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setShowDashboard(scrollTop < 100);
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
          {t('scopes.rooms.plural')}
        </Typography>
        <Grid container spacing={2}>
          {isLoading && <RoomCardSkeleton />}
          {error && <Typography>{t('errors.noData')}</Typography>}
          {rooms.map((room) => (
            <RoomCard room={room} key={room.hash_id} />
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
