import { AppIconButton } from '@/components';
import { UserType } from '@/types/Scopes';
import { Stack, TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  user: UserType;
  option: 'email' | 'realname' | 'username';
  unlocked: boolean;
  setUnlocked: Dispatch<SetStateAction<'realname' | 'email' | 'username' | undefined>>;
  control: Control<
    {
      about_me?: string | undefined;
      displayname?: string | undefined;
      realname: string;
      email?: string;
      username: string;
    },
    any
  >;
}

/** * Renders "requests" view
 * url: /settings/requests
 */
const RestrictedField = ({ user, option, unlocked, setUnlocked, control }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="start" width="100%" gap={2}>
      <Controller
        // @ts-ignore
        name={option}
        control={control}
        // @ts-ignore
        defaultValue={user[option]}
        // @ts-ignore
        render={({ field, fieldState }) => (
          <TextField
            label={t(`settings.${option}`)}
            variant="filled"
            size="small"
            required={option !== 'email'}
            disabled={!unlocked}
            fullWidth
            {...field}
            error={!!fieldState.error}
            helperText={fieldState.error?.message || ' '}
            slotProps={{ inputLabel: { shrink: !!field.value } }}
          />
        )}
      />
      {!unlocked && (
        <AppIconButton color="secondary" icon="edit" sx={{ mt: 0.5 }} onClick={() => setUnlocked(option)} />
      )}
    </Stack>
  );
};

export default RestrictedField;
