import { RoomCard } from '@/components/RoomCard';
import RoomCardSkeleton from '@/components/RoomCard/RoomCardSkeleton';
import { RoomType } from '@/types/Scopes';
import { getRooms } from '@/services/rooms';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashBoard from './DashBoard';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setShowDashboard(scrollTop < 100);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getRooms();
      setLoading(false);
      setError(response.error);
      if (!response.error && response.data) setRooms(response.data);
    };

    fetchRooms();
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
          {error && <Typography>{t(error)}</Typography>}
          {rooms.map((room) => (
            <RoomCard room={room} key={room.hash_id} />
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
