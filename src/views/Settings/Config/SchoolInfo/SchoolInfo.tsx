import { RoomForms } from '@/components/DataForms';
import { getRooms } from '@/services/rooms';
import { useAppStore } from '@/store';
import { RoomType } from '@/types/Scopes';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SchoolInfoSkeleton from './SchoolInfoSkeleton';

const SchoolInfo: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomType>();

  const fetchRoom = async () => {
    setLoading(true);
    const response = await getRooms({
      offset: 0,
      limit: 0,
      type: 1,
    });

    if (response.error) setError(response.error);
    if (response.data) setRoom(response.data[0]);
    setLoading(false);
  };

  const onClose = () => {
    dispatch({
      type: 'ADD_POPUP',
      message: { message: t('settings.messages.updated', { var: t(`ui.navigation.settings`) }), type: 'success' },
    });
    fetchRoom();
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  return (
    <Stack gap={2} mb={1.5}>
      <Typography variant="h2" py={1}>
        {t(`settings.labels.school`)}
      </Typography>
      {!isLoading && room ? <RoomForms onClose={onClose} defaultValues={room} isDefault /> : <SchoolInfoSkeleton />}
    </Stack>
  );
};

export default SchoolInfo;
