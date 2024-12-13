import { AppButton, AppIconButton } from '@/components';
import { useAppStore } from '@/store';
import { ObjectPropByName } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputAdornment, Slider, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
  onReload: () => void | Promise<void>;
}

/** * Renders "QuorumSettings" component
 */

const QuorumSettings = ({ onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const { setValue, handleSubmit, control } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        quorum_wild_ideas: yup.number(),
        quorum_votes: yup.number(),
      })
    ),
  });

  async function getQuorum() {
    await databaseRequest({
      model: 'Settings',
      method: 'getQuorum',
      arguments: {},
    }).then((response) => {
      if (!response.success || !response.data) return;
      setValue('quorum_wild_ideas', Number(response.data.quorum_wild_ideas));
      setValue('quorum_votes', Number(response.data.quorum_votes));
    });
  }

  async function addQuorum(fieldValues: ObjectPropByName) {
    await databaseRequest(
      {
        model: 'Settings',
        method: 'setQuorum',
        arguments: fieldValues,
      },
      ['updater_id']
    ).then((response) => {
      if (!response.success) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('generics.wrong'), type: 'error' } });
        return;
      }
      dispatch({ type: 'ADD_POPUP', message: { message: t('texts.customField'), type: 'success' } });
      onReload();
    });
  }

  useEffect(() => {
    getQuorum();
  }, []);

  const marks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 25,
      label: '25%',
    },
    {
      value: 50,
      label: '50%',
    },
    {
      value: 75,
      label: '75%',
    },
    {
      value: 100,
      label: '100%',
    },
  ];

  function valueText(value: number) {
    return `${value}%`;
  }

  return (
    <Stack gap={2}>
      <Typography variant="h6">{t(`settings.quorum`)}</Typography>
      <Typography variant="subtitle2" color="secondary">
        {t(`views.ideas`).replace(/^./, (char) => char.toUpperCase())}
      </Typography>
      <Controller
        name="quorum_wild_ideas"
        control={control}
        defaultValue={50}
        render={({ field: { value, ...field } }) => (
          <Slider
            {...field}
            value={value}
            orientation="horizontal"
            aria-label="Wild Ideas Quorum"
            valueLabelDisplay="auto"
            valueLabelFormat={valueText}
            min={0}
            max={100}
            step={5}
            marks={marks}
          />
        )}
      />
      <Typography variant="subtitle2" color="secondary">
        {t(`views.votes`).replace(/^./, (char) => char.toUpperCase())}
      </Typography>
      <Controller
        name="quorum_votes"
        control={control}
        defaultValue={50}
        render={({ field: { value, ...field } }) => (
          <Slider
            {...field}
            value={value}
            orientation="horizontal"
            aria-label="Votes Quorum"
            valueLabelDisplay="auto"
            valueLabelFormat={valueText}
            min={0}
            max={100}
            step={5}
            marks={marks}
          />
        )}
      />
      <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(addQuorum)}>
        {t('generics.save')}
      </AppButton>
    </Stack>
  );
};

export default QuorumSettings;
