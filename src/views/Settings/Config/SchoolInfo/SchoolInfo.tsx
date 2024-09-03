import { Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SchoolInfo = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={1}>
      <Typography variant="h5" py={1}>
        {t(`settings.school`)}
      </Typography>
      <TextField label={t(`settings.name`)} fullWidth />
      <TextField label={t(`settings.description`)} minRows={4} multiline type="text" fullWidth />
      <Stack direction="row">
        <Button color="error" sx={{ ml: 'auto', mr: 2 }}>
          {t('generics.cancel')}
        </Button>
        <Button type="submit" variant="contained">
          {t('generics.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SchoolInfo;
