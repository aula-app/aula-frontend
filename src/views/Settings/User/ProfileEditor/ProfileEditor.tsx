import { AppButton, AppIcon } from '@/components';
import ImageEditor from '@/components/ImageEditor';
import UserAvatar from '@/components/UserAvatar';
import { useAppStore } from '@/store';
import { ObjectPropByName } from '@/types/Generics';
import { UserType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import RestrictedField from './RestrictedField';

/** * Renders "SystemSettings" component
 */

interface Props {
  user: UserType;
  onReload: () => void;
}

const SystemSettings = ({ user, onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [updates, setUpdates] = useState<Array<[keyof typeof schema.fields, string | undefined]>>([]);
  const [isEditingImage, setEditingImage] = useState(false);
  const [updateAvatar, setUpdateAvatar] = useState(false);
  const [openDialog, setDialog] = useState(false);
  const [unlocked, setUnlocked] = useState<'realname' | 'email' | 'username'>();

  const schema = yup.object({
    realname: yup
      .string()
      .max(30, t('validation.max', { var: 30 }))
      .min(3, t('validation.min', { var: 3 }))
      .required(),
    username: yup
      .string()
      .max(30, t('validation.max', { var: 30 }))
      .min(3, t('validation.min', { var: 3 }))
      .required(),
    email: yup.string().email(),
    about_me: yup.string(),
    displayname: yup.string().max(30, t('validation.max', { var: 30 })),
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const requestUpdates = () => {
    updates.forEach((update) => {
      sendMessage(update);
    });
    dispatch({
      type: 'ADD_POPUP',
      message: {
        message: t('texts.updated', { var: String(updates.map((update) => ` ${update[0]}`)) }),
        type: 'success',
      },
    });
    closeDialog();
  };

  const sendMessage = async (field: [keyof typeof schema.fields, string | undefined]) => {
    if (!field[0] || !field[1]) return;
    await databaseRequest(
      {
        model: 'Message',
        method: 'addMessage',
        arguments: {
          headline: `Data change request for ${user.realname}`,
          body: JSON.stringify({
            type: 'changeName',
            data: { id: user.id, property: field, from: String(user[field[0]]), to: field[1] },
            content: `A data change procedure was requested for user ${user.realname}. They want to change their ${field[0]} to ${field[1]}`,
          }),
          msg_type: 5,
        },
      },
      ['creator_id', 'updater_id']
    ).then((response) => {
      if (!response.success) return;
      onReload();
    });
  };

  const setUserInfo = async (method: string, args: ObjectPropByName) => {
    databaseRequest(
      {
        model: 'User',
        method: method,
        arguments: args,
      },
      ['user_id', 'updater_id']
    ).then((response) => {
      if (response.success)
        dispatch({
          type: 'ADD_POPUP',
          message: {
            message: t('texts.updateRequest', { var: t(`settings.${Object.keys(args)[0]}`) }),
            type: 'success',
          },
        });
      onReload();
    });
  };

  const onSubmit = (formData: {
    about_me?: string | undefined;
    displayname?: string | undefined;
    email?: string;
    realname: string;
    username: string;
  }) => {
    setUnlocked(undefined);
    const updatedFields = [] as Array<[keyof typeof schema.fields, string | undefined]>;
    (Object.keys(formData) as Array<keyof typeof schema.fields>).forEach((form) => {
      if (formData[form] === user[form]) return;
      switch (form) {
        case 'about_me':
          setUserInfo('setUserAbout', { [form]: formData[form] });
          break;
        case 'displayname':
          setUserInfo('setUserDisplayname', { [form]: formData[form] });
          break;
        default:
          updatedFields.push([form, formData[form]]);
          break;
      }
      if (updatedFields.length > 0) setUpdates(updatedFields);
    });
  };

  const closeDialog = () => {
    setDialog(false);
    (['realname', 'email', 'username'] as Array<keyof typeof schema.fields>).forEach((field) => {
      setValue(field, user[field]);
    });
  };

  const toggleDrawer = () => {
    setUpdateAvatar(!updateAvatar);
    setEditingImage(!isEditingImage);
  };

  useEffect(() => {
    if (updates.length > 0) setDialog(true);
  }, [updates.length]);

  useEffect(() => {
    setValue('about_me', user.about_me);
    setValue('displayname', user.displayname);
  }, [user]);

  return (
    <FormContainer>
      <Stack alignItems="center" p={2} gap={2}>
        <IconButton onClick={toggleDrawer} sx={{ position: 'relative' }}>
          <Stack
            color="white"
            bgcolor={grey[400]}
            p={1}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              zIndex: 999,
            }}
          >
            <AppIcon icon="camera" />
          </Stack>
          <UserAvatar id={user.id} update={updateAvatar} />
        </IconButton>
        <RestrictedField
          user={user}
          unlocked={unlocked === 'realname'}
          setUnlocked={setUnlocked}
          control={control}
          option={'realname'}
        />
        <RestrictedField
          user={user}
          unlocked={unlocked === 'username'}
          setUnlocked={setUnlocked}
          control={control}
          option={'username'}
        />
        <RestrictedField
          user={user}
          unlocked={unlocked === 'email'}
          setUnlocked={setUnlocked}
          control={control}
          option={'email'}
        />
        <TextField
          label={t('settings.displayname')}
          {...register('displayname')}
          error={errors.displayname ? true : false}
          helperText={errors.displayname?.message || ' '}
          fullWidth
          slotProps={{ inputLabel: { shrink: !!user.displayname } }}
          onFocus={() => setUnlocked(undefined)}
        />
        <TextField
          multiline
          minRows={5}
          label={t('settings.about_me')}
          {...register('about_me')}
          error={errors.about_me ? true : false}
          helperText={errors.about_me?.message || ' '}
          onFocus={() => setUnlocked(undefined)}
          fullWidth
        />
        <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(onSubmit)}>
          {t('generics.save')}
        </AppButton>
      </Stack>
      {user && (
        <ImageEditor
          isOpen={isEditingImage}
          closeMethod={() => {
            setUpdateAvatar(!updateAvatar);
            toggleDrawer();
          }}
          id={user.id}
        />
      )}
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error" sx={{ display: 'flex', alignItems: 'center' }}>
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('texts.dataUpdate')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('texts.dataUpdateText', { var: String(updates.map((update) => ` ${update[0]}`)) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary" autoFocus>
            {t('generics.cancel')}
          </Button>
          <Button onClick={requestUpdates} color="error" variant="contained">
            {t('generics.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
};

export default SystemSettings;
