import { AppIcon } from '@/components';
import ChangePassword from '@/components/ChangePassword';
import DataDelete from '@/components/DataDelete';
import DataExport from '@/components/DataExport';
import { getSelf } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileEditor from './ProfileEditor';
import ProfileEditorSkeleton from './ProfileEditor/ProfileEditorSkeleton';

/** * Renders "User" view
 * url: /settings/user
 */
const UserView = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType>();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const response = await getSelf();
    if (response.error) setError(response.error);
    if (!response.error && response.data) setUser(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {isLoading && <ProfileEditorSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {user && !isLoading && (
        <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
          <Typography variant="h4">{t('ui.navigation.profile')}</Typography>
          <ProfileEditor user={user} onReload={fetchUser} />
          <Accordion>
            <AccordionSummary
              expandIcon={<AppIcon icon="arrowdown" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography variant="h4">{t('ui.navigation.security')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ChangePassword />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<AppIcon icon="arrowdown" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography variant="h4">{t('ui.navigation.privacy')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DataExport user={user} onReload={fetchUser} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<AppIcon icon="arrowdown" />}
              aria-controls="panel2-content"
              id="panel2-header"
              sx={{
                backgroundColor: red[100],
              }}
            >
              <Typography variant="h4">{t('settings.panels.danger')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DataDelete user={user} onReload={fetchUser} />
            </AccordionDetails>
          </Accordion>
        </Stack>
      )}
    </>
  );
};

export default UserView;
