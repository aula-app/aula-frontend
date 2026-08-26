import { getMigrationProgress } from '@/services/idpMigration';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * The way into the migration screen, on the page an admin already goes to.
 *
 * It shows itself only once an operator has flagged the school in
 * aula-manager: a school that will never migrate should not be offered a
 * button that only ever says "not enabled".
 */
const IdpSyncEntry: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    getMigrationProgress().then((progress) => setMigrating(!!progress?.migration_status));
  }, []);

  if (!migrating) return null;

  return (
    <Alert severity="info" sx={{ mb: 2 }} data-testid="config-idp-sync-entry">
      <Stack gap={1} alignItems="flex-start">
        <Typography variant="h2">{t('idp.sync.title')}</Typography>
        <Typography variant="body2">{t('idp.sync.entry.body')}</Typography>
        <Button variant="contained" onClick={() => navigate('/settings/idp-sync')} data-testid="config-idp-sync-open">
          {t('idp.sync.actions.open')}
        </Button>
      </Stack>
    </Alert>
  );
};

export default IdpSyncEntry;
