import { getQuorum, setQuorum } from '@/services/vote';
import { useAppStore } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Slider, SliderProps, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props extends SliderProps {
  onReload: () => void | Promise<void>;
}

/** * Renders "QuorumSettings" component
 */

const QuorumSettings: React.FC<Props> = ({ onReload, ...restOfProps }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const { setValue, handleSubmit, control } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        quorum_wild_ideas: yup.number().required(t('forms.validation.required')),
        quorum_votes: yup.number().required(t('forms.validation.required')),
      })
    ),
  });

  async function getQuorumValues() {
    const response = await getQuorum();
    if (!response.data) return;
    setValue('quorum_wild_ideas', Number(response.data.quorum_wild_ideas));
    setValue('quorum_votes', Number(response.data.quorum_votes));
  }

  async function addQuorum(data: { quorum_wild_ideas: number; quorum_votes: number }) {
    const response = await setQuorum(data.quorum_wild_ideas, data.quorum_votes);
    if (!response.data) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      return;
    }
    dispatch({
      type: 'ADD_POPUP',
      message: { message: t('settings.messages.updated', { var: t('settings.labels.quorum') }), type: 'success' },
    });
    onReload();
  }

  useEffect(() => {
    getQuorumValues();
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
      <Typography variant="h3">{t(`settings.labels.quorum`)}</Typography>
      <Typography variant="h4" color="secondary">
        {t('phases.phase', { var: t(`phases.wild`).replace(/^./, (char) => char.toUpperCase()) })}
      </Typography>
      <Controller
        name="quorum_wild_ideas"
        control={control}
        defaultValue={10}
        render={({ field: { value, ...field } }) => (
          <Slider
            {...field}
            value={value}
            orientation="horizontal"
            aria-label={t('settings.labels.quorumLabel', { var: t(`phases.wild`) })}
            valueLabelDisplay="auto"
            valueLabelFormat={valueText}
            min={0}
            max={100}
            step={5}
            marks={marks}
          />
        )}
      />
      <Typography variant="h4" color="secondary">
        {t('phases.phase', { var: t(`phases.voting`).replace(/^./, (char) => char.toUpperCase()) })}
      </Typography>
      <Controller
        name="quorum_votes"
        control={control}
        defaultValue={25}
        render={({ field: { value, ...field } }) => (
          <Slider
            {...field}
            value={value}
            orientation="horizontal"
            aria-label={t('settings.labels.quorumLabel', { var: t(`ui.units.votes`) })}
            valueLabelDisplay="auto"
            valueLabelFormat={valueText}
            min={0}
            max={100}
            step={5}
            marks={marks}
            {...restOfProps}
          />
        )}
      />
      <Button variant="contained" type="submit" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(addQuorum)}>
        {t('actions.save')}
      </Button>
    </Stack>
  );
};

export default QuorumSettings;
