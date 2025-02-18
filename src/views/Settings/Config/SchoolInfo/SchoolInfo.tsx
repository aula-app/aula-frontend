import { useAppStore } from '@/store';
import { ConfigResponse } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  config?: ConfigResponse;
  onReload: () => void;
}

const SchoolInfo = ({ config, onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [name, setName] = useState<String>(config?.name || '');
  const [description, setDescription] = useState<String>(config?.description_public || '');

  const onSubmit = async () => {
    await databaseRequest(
      {
        model: 'Settings',
        method: 'setInstanceInfo',
        arguments: {
          name: name,
          description: description,
        },
      },
      ['updater_id']
    ).then((response) => {
      if (response.data)
        dispatch({
          type: 'ADD_POPUP',
          message: { message: t('settings.messages.updated', { var: t(`ui.navigation.settings`) }), type: 'success' },
        });
      onReload();
    });
  };

  const onCancel = () => {
    setName(config?.name || '');
    setDescription(config?.description_public || '');
  };

  useEffect(() => {
    onCancel();
  }, [config]);

  return (
    <Stack gap={2} mb={1.5}>
      <Typography variant="h5" py={1}>
        {t(`settings.labels.school`)}
      </Typography>
      <TextField
        label={t(`settings.columns.name`)}
        value={name}
        onChange={(data) => setName(data.target.value)}
        fullWidth
      />
      <TextField
        label={t(`settings.general.description`)}
        value={description}
        onChange={(data) => setDescription(data.target.value)}
        minRows={4}
        multiline
        type="text"
        fullWidth
      />
      <Stack direction="row">
        <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
        <Button type="submit" variant="contained" onClick={onSubmit}>
          {t('actions.confirm')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SchoolInfo;
