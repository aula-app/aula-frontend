import { Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

/** * Renders "SystemSettings" component
 */

const SystemSettings = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={2}>
      <Button variant="contained" color="secondary" fullWidth>
        {t('settings.backup')}
      </Button>
      <Button variant="contained" color="info" fullWidth>
        {t('settings.backupRestore')}
      </Button>
    </Stack>
  );
};

export default SystemSettings;
