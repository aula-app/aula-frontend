import { AppIcon } from '@/components';
import { MarkdownEditor } from '@/components/DataFields';
import UserAvatar from '@/components/UserAvatar';
import { addMessage } from '@/services/messages';
import { editSelfAbout, editSelfRestricted } from '@/services/users';
import { useSsoManaged } from '@/hooks';
import { useAppStore } from '@/store';
import { UserType } from '@/types/Scopes';
import { checkPermissions, errorAlert, successAlert } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ImageEditor from '../ImageEditor';
import RestrictedField from './RestrictedField';

interface Props {
  user: UserType;
  onReload: () => void;
}

/** * Renders "SystemSettings" component
 */

const ProfileEditor: React.FC<Props> = ({ user, onReload }) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const isSsoManaged = useSsoManaged();

  const [updateRequests, setUpdateRequests] = useState<Array<fieldOptions>>([]);
  const [editImage, setEditImage] = useState(false);

  const schema = yup.object({
    realname: isSsoManaged
      ? yup.string().nullable()
      : yup
          .string()
          .max(30, t('forms.validation.maxLength', { var: 30 }))
          .min(3, t('forms.validation.minLength', { var: 3 }))
          .required(t('forms.validation.required')),
    username: isSsoManaged
      ? yup.string().nullable()
      : yup
          .string()
          .max(30, t('forms.validation.maxLength', { var: 30 }))
          .min(3, t('forms.validation.minLength', { var: 3 }))
          .required(t('forms.validation.required')),
    email: yup.string().email(t('forms.validation.email')).nullable(),
    about_me: yup.string(),
    displayname: yup
      .string()
      .max(30, t('forms.validation.maxLength', { var: 30 }))
      .required(t('forms.validation.required')),
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;
  type fieldOptions = { field: keyof SchemaType; value: string | null | undefined };

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: user,
    resolver: yupResolver(schema),
  });

  const userFields = ['displayname', 'username', 'realname', 'email', 'about_me'] as Array<keyof SchemaType>;

  const isLockedField = (field: keyof SchemaType) => isSsoManaged && field !== 'displayname' && field !== 'about_me';

  const isAdmin = checkPermissions('users', 'edit');

  const requiredFields: Array<keyof SchemaType> = ['displayname', 'username', 'realname'];
  const isRequiredField = (field: keyof SchemaType) => requiredFields.includes(field) && !isLockedField(field);

  const approveUpdates = async () => {
    try {
      await Promise.all(updateRequests.map((update) => sendMessage(update)));
      closeDialog();
      onReload();
    } catch (error) {
      console.error('Error sending update requests:', error);
    }
  };

  const sendMessage = async (field: fieldOptions) => {
    const response = await addMessage({
      msg_type: 6,
      headline: `${t('requests.changeName.title', { var: user.realname })}: ${field.field}`,
      body: `
---
type: changeName
id: ${user.hash_id}
property: ${field.field}
value: ${field.value}
---
${t('requests.changeName.body', { var: user.realname, old: user[field.field], new: field.value })}`,
    });

    if (response.error) {
      errorAlert(t(response.error), dispatch);
      throw new Error(response.error);
    }

    successAlert(t('requests.changeName.request'), dispatch);
    return response;
  };

  const onSubmit = (data: SchemaType) => {
    if (!user) return;

    const changedFields = userFields.filter((field) => !isLockedField(field) && data[field] !== user[field]);
    const identityChanges = changedFields.filter((field) => field !== 'about_me');

    if (identityChanges.length > 0 && !isAdmin) {
      setUpdateRequests(identityChanges.map((field) => ({ field, value: data[field] })));
      if (changedFields.includes('about_me')) updateProfile(['about_me'], data);
      return;
    }

    updateProfile(changedFields, data);
  };

  const onInvalid = () => {
    if (!user) return;
    const data = getValues() as SchemaType;
    if (data.about_me !== user.about_me) updateProfile(['about_me'], data);
  };

  const updateProfile = async (fields: Array<keyof SchemaType>, data: SchemaType) => {
    if (fields.length === 0) return;

    const results = await Promise.all(
      fields.map((field) =>
        field === 'about_me'
          ? editSelfAbout(data.about_me ?? '')
          : editSelfRestricted({ field, id: user.hash_id, value: data[field] ?? '' })
      )
    );

    results.some((response) => response.error)
      ? errorAlert(t('settings.messages.notUpdated', { var: t('ui.navigation.profile') }), dispatch)
      : successAlert(t('settings.messages.updated', { var: t('ui.navigation.profile') }), dispatch);
  };

  const resetFields = () => {
    userFields.map((field) => setValue(field, user[field]));
  };

  const closeDialog = () => setUpdateRequests([]);

  const onClose = () => {
    setEditImage(false);
    onReload();
  };

  useEffect(() => {
    resetFields();
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <Stack direction="row" flexWrap="wrap" py={2} gap={2}>
        <Button
          color="secondary"
          onClick={() => setEditImage(true)}
          sx={{ position: 'relative' }}
          aria-label={t('ui.accessibility.editUserAvatar')}
          tabIndex={0} // First focusable element in the form
        >
          <AppIcon
            icon="edit"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              bgcolor: 'background.paper',
              zIndex: 999,
            }}
            aria-hidden="true" // Hide from screen readers as we have a proper label on the button
          />
          <UserAvatar id={user.hash_id} size={180} sx={{ mx: 'auto' }} />
        </Button>
        {user && <ImageEditor isOpen={editImage} onClose={onClose} id={user.hash_id} />}
        <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
          {userFields.slice(0, -1).map((name, i) => (
            <RestrictedField
              key={i}
              name={name}
              control={control}
              tabIndex={i + 1}
              locked={isLockedField(name)}
              required={isRequiredField(name)}
            />
          ))}
        </Stack>
        <MarkdownEditor name="about_me" control={control} sx={{ flex: 2, minWidth: `min(300px, 100%)` }} />
      </Stack>
      <Stack direction="row" justifyContent="end" gap={2} mb={2}>
        <Button color="error" onClick={resetFields} type="button" tabIndex={0} aria-label={t('actions.cancel')}>
          {t('actions.cancel')}
        </Button>
        <Button variant="contained" type="submit" tabIndex={0} aria-label={t('actions.save')}>
          {t('actions.save')}
        </Button>
      </Stack>
      <Dialog
        open={updateRequests.length > 0}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        aria-modal="true"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} aria-hidden="true" /> {t('requests.updateData.headline')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('requests.updateData.confirm')}
            <Stack my={1} role="list" aria-label={t('ui.accessibility.requestedChanges')}>
              {updateRequests.map((update, index) => (
                <Stack direction="row" key={`update-${index}`} role="listitem" sx={{ mb: 1 }}>
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
          <Button onClick={closeDialog} color="secondary" autoFocus tabIndex={0} aria-label={t('actions.cancel')}>
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={approveUpdates}
            color="error"
            variant="contained"
            tabIndex={0}
            aria-label={t('actions.confirm')}
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default ProfileEditor;
