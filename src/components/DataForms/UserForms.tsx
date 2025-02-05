import { UserArguments } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, RoleField, StatusField } from '../DataFields';

/**
 * UserForms component is used to create or edit an user.
 *
 * @component
 */

interface UserFormsProps {
  children?: React.ReactNode;
  onClose: () => void;
  defaultValues?: UserArguments;
  onSubmit: (data: UserArguments) => void;
}

const UserForms: React.FC<UserFormsProps> = ({ children, defaultValues, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    displayname: yup.string().required(t('forms.validation.required')),
    realname: yup.string().required(t('forms.validation.required')),
    username: yup.string().required(t('forms.validation.required')),
    email: yup.string(),
    about_me: yup.string(),
    userlevel: yup.number(),
    status: yup.number(),
  } as Record<keyof UserType, any>);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.users.name`).toLowerCase(),
              })}
            </Typography>
            <Stack direction="row" gap={2}>
              {children}
              {checkPermissions(40) && <StatusField control={control} />}
            </Stack>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
              <TextField
                fullWidth
                required
                label={t(`settings.columns.displayname`)}
                size="small"
                error={!!errors.displayname}
                helperText={errors.displayname?.message}
                {...register('displayname')}
              />
              <TextField
                fullWidth
                required
                label={t(`settings.columns.username`)}
                size="small"
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register('username')}
              />
              <TextField
                fullWidth
                required
                label={t(`settings.columns.realname`)}
                size="small"
                error={!!errors.realname}
                helperText={errors.realname?.message}
                {...register('realname')}
              />
              <TextField
                fullWidth
                label={t(`settings.columns.email`)}
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
              {checkPermissions(40) && Number(defaultValues?.userlevel) < 50 && <RoleField control={control} />}
            </Stack>
            <MarkdownEditor name="about_me" control={control} sx={{ flex: 2, minWidth: `min(300px, 100%)` }} />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default UserForms;
