import { Box, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { InputSettings } from '../../EditData/DataConfig';
import SelectField from './SelectField';
import { inputType } from '../../EditData/DataConfig/formDefaults';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  setValue: any;
  getValues: any;
};

/**
 * Renders "MessageTarget" component
 */

const MessageTarget = ({ data, control, disabled = false, setValue, getValues, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [recipientType, setRecipientType] = useState(0);

  const recipientTypes = {
    room_id: { name: 'room', options: 'rooms' },
    target_id: { name: 'user', options: 'users' },
    target_group: { name: 'group', options: 'users' },
  } as Record<keyof PossibleFields, { name: string; options: SettingNamesType }>;

  const changeType = (event: any) => {
    setRecipientType(event.target.value);
  };

  const clearValues = () => {
    Object.keys(recipientTypes).forEach((field) => {
      // @ts-ignore
      setValue(field, 0);
    });
  };

  useEffect(() => {
    clearValues();
  }, [recipientType]);

  return (
    <Stack direction="row" gap={2} alignItems="center">
      {t('texts.recipient')}:
      <TextField
        label={t(`views.category`)}
        select
        value={recipientType}
        onChange={changeType}
        sx={{ mb: 3, order: 0, minWidth: 100, display: disabled ? 'none' : 'box' }}
        {...restOfProps}
      >
        {Object.values(recipientTypes).map((type, i) => (
          <MenuItem value={i} key={i}>
            {type.name}
          </MenuItem>
        ))}
      </TextField>
      {Object.entries(recipientTypes).map(([fieldName, fieldData], i) => {
        const currentData: InputSettings = {
          ...data,
          name: fieldName as keyof PossibleFields,
          form: {
            ...inputType.select,
            options: fieldData.options,
          } as inputType,
        };
        const isHidden = disabled ? getValues()[fieldName] === 0 : recipientType !== i;
        return (
          <Box sx={{ display: isHidden ? 'none' : 'box' }} flex={1} key={`field${i}`}>
            <SelectField data={currentData} control={control} disabled={disabled} />
          </Box>
        );
      })}
    </Stack>
  );
};

export default MessageTarget;
