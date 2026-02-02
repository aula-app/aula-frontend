import { AppIcon } from '@/components';
import ChangePassword from '@/components/ChangePassword';
import DataDelete from '@/components/DataDelete';
import DataExport from '@/components/DataExport';
import ProfileEditor from '@/components/ProfileEditor';
import ProfileEditorSkeleton from '@/components/ProfileEditor/ProfileEditorSkeleton';
import { getSelf } from '@/services/users';
import { useAppStore } from '@/store/AppStore';
import { UserType } from '@/types/Scopes';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "User" view
 * url: /settings/user
 */
const UserView = () => {
  const { t } = useTranslation();
  usePageTitle('pageTitles.settings.profile');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType>();
  const [appState, dispatch] = useAppStore();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const response = await getSelf();
    if (response.error) setError(response.error);
    if (!response.error && response.data) setUser(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.profile'), '']] });
    fetchUser();
  }, []);

  return (
    <>
      {isLoading && <ProfileEditorSkeleton />}
      {user && !isLoading && (
        <Stack width="100%" height="100%" sx={{ overflowY: 'auto', overscrollBehavior: 'contain' }} p={2}>
          <Typography variant="h1">{t('ui.navigation.profile')}</Typography>
          <ProfileEditor user={user} onReload={fetchUser} />
          <Accordion>
            <AccordionSummary
              expandIcon={<AppIcon icon="arrowdown" />}
              aria-controls="panel2-content-security"
              id="panel2-header-security"
              data-testid="security-panel-button"
            >
              <Typography variant="h2">{t('ui.navigation.security')}</Typography>
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
              data-testid="privacy-panel-button"
            >
              <Typography variant="h2">{t('ui.navigation.privacy')}</Typography>
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
              data-testid="danger-panel-button"
              sx={{
                backgroundColor: red[100],
              }}
            >
              <Typography variant="h2">{t('settings.panels.danger')}</Typography>
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
