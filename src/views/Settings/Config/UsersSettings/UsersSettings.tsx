import { AppIcon } from '@/components';
import { databaseRequest } from '@/utils';
import { Button, Stack } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';

interface Props {
  onReload: () => void;
}

/** * Renders "SystemSettings" component
 */

const DataSettings = ({ onReload }: Props) => {
  const { t } = useTranslation();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;

    Array.from(e.target.files).forEach((file) => readCSV(file));
  };

  const readCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (!reader.result) return;
      const lines = String(reader.result).split('\n');
      lines.splice(0, 1);
      uploadCSV(lines.join('\n'));
    };
    reader.readAsText(file);
  };

  const uploadCSV = async (csv: string) => {
    await databaseRequest({
      model: 'User',
      method: 'addCSV',
      arguments: { csv: csv },
    }).then((response) => {
      if (response.success) onReload();
    });
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center" mb={2} gap={1}>
        {t('texts.fileDownload')}:{' '}
        <a href="/data/aula_users.csv" download target="_blank" rel="noreferrer">
          <Button color="secondary" variant="outlined">
            <AppIcon icon="download" size="small" sx={{ mr: 1, ml: -0.5 }} />
            aula_users.csv
          </Button>
        </a>
      </Stack>
      <Button variant="contained" component="label">
        {t('texts.fileUpload')}
        <input type="file" name="my_files" multiple hidden onChange={handleFileChange} />
      </Button>
    </Stack>
  );
};

export default DataSettings;
