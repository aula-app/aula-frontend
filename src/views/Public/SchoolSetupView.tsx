import { IdpImportStatus } from '@/services/sso';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  status: IdpImportStatus | null;
};

/**
 * Shown while a school is being imported from its identity provider.
 *
 * The first person to sign in triggers the import of every room and user. It
 * runs on the backend queue, so the login itself returns immediately and this
 * holds the user until the school is actually there — arriving early would mean
 * an aula with no classmates and no rooms.
 *
 * A failed import says so rather than spinning forever; there is nothing the
 * user can do about it, so it points them at their administrator.
 */
const SchoolSetupView: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation();
  const failed = status?.status === 'failed';

  return (
    <Stack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap={3}
      p={4}
      textAlign="center"
      data-testid="school-setup-view"
    >
      <img src="/img/Paula_schlafend.svg" alt="" role="presentation" loading="lazy" width={150} />

      {failed ? (
        <>
          <Typography variant="h6" data-testid="school-setup-failed">
            {t('idp.setup.failedTitle')}
          </Typography>
          <Typography color="text.secondary">{t('idp.setup.failedBody')}</Typography>
        </>
      ) : (
        <>
          <CircularProgress color="success" />
          <Typography variant="h6" data-testid="school-setup-message">
            {t('idp.setup.title')}
          </Typography>
          <Typography color="text.secondary">{t('idp.setup.body')}</Typography>
          {/* Counts only mean something once the import has written them. */}
          {!!status && status.rooms + status.users > 0 && (
            <Typography variant="body2" color="text.secondary" data-testid="school-setup-progress">
              {t('idp.setup.progress', { rooms: status.rooms, users: status.users })}
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
};

export default SchoolSetupView;
