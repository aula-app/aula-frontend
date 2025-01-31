import { MarkdownEditor } from '@/components/Data/DataFields';
import UserAvatar from '@/components/UserAvatar';
import { editSelf, getSelf } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Controller, FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ProfileEditorSkeleton from './ProfileEditorSkeleton';
import { AppIcon } from '@/components';
import RestrictedField from './RestrictedField';
import { useAppStore } from '@/store';
import { addMessage } from '@/services/messages';
import { errorAlert, successAlert } from '@/utils';

/** * Renders "SystemSettings" component
 */

const ProfileEditor: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType>();

  const [updateRequests, setUpdateRequests] = useState<Array<fieldOptions>>([]);

  const schema = yup.object({
    realname: yup
      .string()
      .max(30, t('forms.validation.maxLength', { var: 30 }))
      .min(3, t('forms.validation.minLength', { var: 3 }))
      .required(),
    username: yup
      .string()
      .max(30, t('forms.validation.maxLength', { var: 30 }))
      .min(3, t('forms.validation.minLength', { var: 3 }))
      .required(),
    email: yup.string().email(),
    about_me: yup.string(),
    displayname: yup
      .string()
      .max(30, t('forms.validation.maxLength', { var: 30 }))
      .required(),
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;
  type fieldOptions = { field: keyof SchemaType; value: string | undefined };

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: user,
    resolver: yupResolver(schema),
  });

  const userFields = ['username', 'realname', 'email', 'displayname', 'about_me'] as Array<keyof SchemaType>;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const response = await getSelf();
    if (response.error) setError(response.error);
    if (!response.error && response.data) setUser(response.data);
    setLoading(false);
  }, []);

  const approveUpdates = () => {
    updateRequests.map((update) => sendMessage(update));
  };

  const sendMessage = async (field: fieldOptions) => {
    if (!user) return;
    await addMessage({
      headline: `${t('requests.changeName.title', { var: user.realname })}: ${field.field}`,
      body: `
          ---
          type: changeName
          id: ${user.hash_id}
          property: ${field.field}
          value: ${field.value}
          ---
          ${t('requests.changeName.body', { var: user.realname, old: user[field.field], new: field.value })}`,
      msg_type: 5,
    }).then((response) => {
      if (response.error) {
        errorAlert(t(response.error), dispatch);
        return;
      }
      successAlert(t('requests.changeName.request'), dispatch);
      resetFields();
    });
  };

  const onSubmit = (data: SchemaType) => {
    if (!user) return;
    let updates = 0;
    userFields.slice(0, -2).map((field) => {
      if (data[field] === user[field]) return;
      setUpdateRequests((prev) => [...prev, { field: field, value: data[field] }]);
      updates++;
    });
    if (updates > 0) return;
    updateProfile(data);
  };

  const updateProfile = async (data: SchemaType) => {
    await editSelf(data).then((response) => {
      console.log(response);
      !response.error
        ? successAlert(t('settings.messages.updated', { var: t('ui.navigation.profile') }), dispatch)
        : errorAlert(t('settings.messages.notUpdated', { var: t('ui.navigation.profile') }), dispatch);
    });
  };

  const resetFields = () => {
    if (!user) return;
    userFields.map((field) => setValue(field, user[field]));
  };

  const closeDialog = () => setUpdateRequests([]);

  useEffect(() => {
    resetFields();
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      {isLoading && <ProfileEditorSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {user && !isLoading && (
        <FormContainer>
          <Stack direction="row" flexWrap="wrap" py={2} gap={2}>
            <UserAvatar id={user.hash_id} size={180} sx={{ mx: 'auto' }} />
            <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
              <Controller
                name="displayname"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth label={t(`settings.columns.displayname`)} size="small" {...field} />
                )}
              />
              {userFields.slice(0, -2).map((name, i) => (
                <RestrictedField key={i} name={name} control={control} />
              ))}
            </Stack>
            <MarkdownEditor name="about_me" control={control} sx={{ flex: 2, minWidth: `min(300px, 100%)` }} />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button color="error" onClick={resetFields}>
              {t('actions.cancel')}
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              {t('actions.save')}
            </Button>
          </Stack>
          <Dialog
            open={updateRequests.length > 0}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
              <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('requests.updateData.headline')}
            </DialogTitle>
            <DialogContent sx={{ overflowY: 'auto' }}>
              <DialogContentText id="alert-dialog-description">
                {t('requests.updateData.confirm')}
                <Stack my={1}>
                  {updateRequests.map((update) => (
                    <Stack direction="row">
                      <b>{t(`settings.columns.${update.field}`)}</b>
                      <Typography mx={1}>{t('ui.common.from')}</Typography>
                      <b>{user[update.field]}</b>
                      <Typography mx={1}>{t('ui.common.to')}</Typography>
                      <b>{update.value}</b>
                    </Stack>
                  ))}
                </Stack>
                {t('requests.updateData.validation')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="secondary" autoFocus>
                {t('actions.cancel')}
              </Button>
              <Button onClick={approveUpdates} color="error" variant="contained">
                {t('actions.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </FormContainer>
      )}
    </>
  );
};

export default ProfileEditor;
