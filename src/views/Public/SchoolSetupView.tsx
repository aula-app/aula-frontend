import { IdpImportPhase } from '@/hooks/useIdpImportGate';
import { IdpImportStatus } from '@/services/sso';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  phase: IdpImportPhase;
  status: IdpImportStatus | null;
  /** Acknowledge the completion notice and enter aula. */
  onDismiss: () => void;
};

/**
 * Shown while a school is being imported from its identity provider, and once
 * more when it finishes.
 *
 * The first person to sign in triggers the import of every room and user. It
 * runs on the backend queue, so the login returns immediately and this holds
 * the user until the school is actually there — arriving early would mean an
 * aula with no classmates and no rooms.
 *
 * Completion is acknowledged rather than skipped past: the wait is the one
 * moment where saying what just happened is worth a click.
 */
const SchoolSetupView: React.FC<Props> = ({ phase, status, onDismiss }) => {
  const { t } = useTranslation();

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

      {phase === 'failed' && (
        <>
          <Typography variant="h6" data-testid="school-setup-failed">
            {t('idp.setup.failedTitle')}
          </Typography>
          <Typography color="text.secondary">{t('idp.setup.failedBody')}</Typography>
          <Button variant="contained" color="success" onClick={onDismiss} data-testid="school-setup-continue">
            {t('idp.setup.continue')}
          </Button>
        </>
      )}

      {phase === 'importing' && (
        <>
          <CircularProgress color="success" />
          <Typography variant="h6" data-testid="school-setup-message">
            {t('idp.setup.title')}
          </Typography>
          <Typography color="text.secondary">{t('idp.setup.body')}</Typography>
        </>
      )}

      {phase === 'done' && (
        <>
          <Typography variant="h6" data-testid="school-setup-done">
            {t('idp.setup.doneTitle')}
          </Typography>
          {/* Counts are the whole point of the notice: they say what arrived. */}
          {!!status && (
            <Typography color="text.secondary" data-testid="school-setup-progress">
              {t('idp.setup.doneBody', { rooms: status.rooms, users: status.users })}
            </Typography>
          )}
          <Button variant="contained" color="success" onClick={onDismiss} data-testid="school-setup-start">
            {t('idp.setup.start')}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default SchoolSetupView;
