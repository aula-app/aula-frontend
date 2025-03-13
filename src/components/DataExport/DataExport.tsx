import { addMessage } from '@/services/messages';
import { useAppStore } from '@/store';
import { UserType } from '@/types/Scopes';
import { errorAlert, successAlert } from '@/utils';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import KnowMore from '../KnowMore';

interface Props {
  user: UserType;
  onReload: () => void;
}

/**
 * Renders data export button
 * @component DataExport
 */
const DataExport: React.FC<Props> = ({ user, onReload }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const requestDataExport = async () => {
    await addMessage({
      headline: `${t('requests.exportData.title', { var: user.displayname })}`,
      body: `
---
type: requestData
id: ${user.hash_id}
realname: ${user.realname}
username: ${user.username}
email: ${user.email}
---
${t('requests.exportData.body', { var: user.displayname })}`,
      msg_type: 5,
    }).then((response) => {
      if (response.error) {
        errorAlert(t(response.error), dispatch);
        return;
      }
      successAlert(t('requests.changeName.request'), dispatch);
      onReload();
    });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h3">
        <KnowMore title={t('requests.exportData.info')}>{t('settings.account.export')}</KnowMore>
      </Typography>

      <Button variant="contained" color="info" onClick={requestDataExport} fullWidth>
        {t('requests.exportData.button')}
      </Button>
    </Stack>
  );
};

export default DataExport;
