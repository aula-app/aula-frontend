import { addMessage } from '@/services/messages';
import { useAppStore } from '@/store';
import { UserType } from '@/types/Scopes';
import { errorAlert, successAlert } from '@/utils';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getUserGDPRData } from '@/services/users';
import KnowMore from '../KnowMore';
import dayjs from 'dayjs';

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

  // if we could pass tenant code by querystring, we could below just do
  //   const userGDPRDataUrl = getUserGDPRDataUrl(user.hash_id)
  //   <Button download="foo.json.txt" href={userGDPRDataUrl}> */}
  const downloadUserGDPRData = () => {
    getUserGDPRData(user.hash_id)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error(`${response.status || ''} ${response.statusText || ''}`);
      })
      .then((blob) => {
        const file = document.createElement('a');
        file.href = URL.createObjectURL(blob);
        file.download = `data_export_${dayjs().format('YYYY-MM-DD_HH:mm')}.json.txt`;
        file.style.display = 'none';
        document.body.appendChild(file);
        file.click();
        document.body.removeChild(file);
      })
      .catch((e) => {
        errorAlert(`${t('errors.default')} (${e.message})`, dispatch)
      });
  }

  return (
    <Stack gap={2}>
      <Typography variant="h3">
        <KnowMore title={t('requests.exportData.info')}>{t('settings.account.export')}</KnowMore>
      </Typography>

      <Button
        variant="contained"
        color="info"
        onClick={downloadUserGDPRData}
        fullWidth
        data-testid="request-data-export-button"
      >
        {t('requests.exportData.button')}
      </Button>
    </Stack>
  );
};

export default DataExport;
