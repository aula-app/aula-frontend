import { AppIconButton } from '@/components';
import { getAnnouncement, setAnnouncementStatus } from '@/services/announcements';
import { AnnouncementType } from '@/types/Scopes';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {t} from "i18next";

/**
 * Renders "Announcement" view
 * url: /announcements
 */

const AnnouncementView = () => {
  const { announcement_id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<AnnouncementType | AnnouncementType>();

  const fetchAnnouncement = useCallback(async () => {
    if (!announcement_id) return;
    setLoading(true);
    const response = await getAnnouncement(announcement_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setAnnouncement(response.data);
    setLoading(false);
  }, [announcement_id]);

  // const giveConsent = async () =>
  //   await databaseRequest(
  //     {
  //       model: 'User',
  //       method: 'giveConsent',
  //       arguments: {
  //         text_id: params['announcement_id'],
  //       },
  //     },
  //     ['user_id']
  //   ).then((response) => {
  //     if (response.data) onArchive(true);
  //   });

  const archiveAnnouncement = async () => {
    if (!announcement) return;
    setAnnouncementStatus({
      status: 3,
      text_id: announcement.hash_id,
    }).then(fetchAnnouncement);
  };

  const unarchiveAnnouncement = async () => {
    if (!announcement) return;
    setAnnouncementStatus({
      status: 1,
      text_id: announcement.hash_id,
    }).then(fetchAnnouncement);
  };

  const toggleArchive = () => {
    if (!announcement) return;
    announcement.status === 1 ? archiveAnnouncement() : unarchiveAnnouncement();
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {isLoading && (
        <Card variant="outlined">
          <CardContent>
            <Skeleton variant="rectangular" height={24} width="30%" sx={{ mb: 3 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="75%" />
          </CardContent>
          <Divider />
          <CardActions>
            <Skeleton variant="rectangular" width={100} sx={{ ml: 'auto', mr: 2, my: 1 }} />
          </CardActions>
        </Card>
      )}
      {error && <Typography variant="h2">{error}</Typography>}
      {!isLoading && announcement && (
        <Card variant="outlined">
          <CardHeader
            title={announcement.headline}
            action={
              <AppIconButton icon={announcement.status === 1 ? 'archive' : 'unarchive'} title={t(`tooltips.${announcement.status === 1 ? 'archive' : 'unarchive'}`)} onClick={toggleArchive} />
            }
          />
          <CardContent>
            <Typography py={2}>{announcement.body}</Typography>
          </CardContent>
          {announcement.user_needs_to_consent > 0 && (
            <CardActions sx={{ justifyContent: 'end' }}>
              <Button color="primary" onClick={() => {}}>
                {announcement.consent_text}
              </Button>
            </CardActions>
          )}
        </Card>
      )}
    </Stack>
  );
};

export default AnnouncementView;
