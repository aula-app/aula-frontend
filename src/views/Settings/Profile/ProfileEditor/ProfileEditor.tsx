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
import { MarkdownEditor } from '@/components/Data/DataFields';

/** * Renders "SystemSettings" component
 */

interface Props {
  user: UserType;
  onReload: () => void;
}

const ProfileEditor = ({ user, onReload }: Props) => {
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
    displayname: yup.string().max(30, t('forms.validation.maxLength', { var: 30 })),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const requestUpdates = () => {
  //   updates.forEach((update) => {
  //     sendMessage(update);
  //   });
  //   dispatch({
  //     type: 'ADD_POPUP',
  //     message: {
  //       message: t('settings.messages.updated', { var: String(updates.map((update) => ` ${update[0]}`)) }),
  //       type: 'success',
  //     },
  //   });
  //   closeDialog();
  // };

  // const sendMessage = async (field: [keyof typeof schema.fields, string | undefined]) => {
  //   if (!field[0] || !field[1]) return;
  //   await databaseRequest(
  //     {
  //       model: 'Message',
  //       method: 'addMessage',
  //       arguments: {
  //         headline: `${user.realname}`,
  //         body: JSON.stringify({
  //           content: '',
  //           data: { type: 'changeName', id: user.id, property: field[0], from: String(user[field[0]]), to: field[1] },
  //         }),
  //         msg_type: 5,
  //       },
  //     },
  //     ['creator_id', 'updater_id']
  //   ).then((response) => {
  //     if (!response.success) return;
  //     onReload();
  //   });
  // };

  // const setUserInfo = async (method: string, args: ObjectPropByName) => {
  //   databaseRequest(
  //     {
  //       model: 'User',
  //       method: method,
  //       arguments: args,
  //     },
  //     ['user_id', 'updater_id']
  //   ).then((response) => {
  //     if (response.success)
  //       dispatch({
  //         type: 'ADD_POPUP',
  //         message: {
  //           message: t('requests.updateData.title', { var: t(`settings.${Object.keys(args)[0]}`) }),
  //           type: 'success',
  //         },
  //       });
  //     onReload();
  //   });
  // };

  // const onSubmit = (formData: {
  //   about_me?: string | undefined;
  //   displayname?: string | undefined;
  //   email?: string;
  //   realname: string;
  //   username: string;
  // }) => {
  //   setUnlocked(undefined);
  //   const updatedFields = [] as Array<[keyof typeof schema.fields, string | undefined]>;
  //   (Object.keys(formData) as Array<keyof typeof schema.fields>).forEach((form) => {
  //     if (formData[form] === user[form]) return;
  //     switch (form) {
  //       case 'about_me':
  //         setUserInfo('setUserAbout', { [form]: formData[form] });
  //         break;
  //       case 'displayname':
  //         setUserInfo('setUserDisplayname', { [form]: formData[form] });
  //         break;
  //       default:
  //         updatedFields.push([form, formData[form]]);
  //         break;
  //     }
  //     if (updatedFields.length > 0) setUpdates(updatedFields);
  //   });
  // };

  // const closeDialog = () => {
  //   setDialog(false);
  //   (['realname', 'email', 'username'] as Array<keyof typeof schema.fields>).forEach((field) => {
  //     setValue(field, user[field]);
  //   });
  // };

  // const toggleDrawer = () => {
  //   setUpdateAvatar(!updateAvatar);
  //   setEditingImage(!isEditingImage);
  // };

  // useEffect(() => {
  //   if (updates.length > 0) setDialog(true);
  // }, [updates.length]);

  // useEffect(() => {
  //   setValue('about_me', user.about_me);
  //   setValue('displayname', user.displayname);
  // }, [user]);

  return (
    <FormContainer>
      <Stack direction="row" flexWrap="wrap" p={2} gap={2}>
        <UserAvatar id={user.hash_id} size={180} sx={{ mx: 'auto' }} />
        <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
          {['realname', 'username', 'email', 'displayname'].map((field) => (
            <TextField
              fullWidth
              key={field}
              label={t(`settings.columns.${field}`)}
              name={field}
              size="small"
              {...register}
            />
          ))}
        </Stack>
        <MarkdownEditor name="about_me" control={control} sx={{ flex: 2, minWidth: `min(300px, 100%)` }} />
      </Stack>
      {/* 
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
          <UserAvatar id={user.hash_id} update={updateAvatar} />
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
          label={t('settings.columns.displayname')}
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
          label={t('settings.columns.about_me')}
          {...register('about_me')}
          error={errors.about_me ? true : false}
          helperText={errors.about_me?.message || ' '}
          onFocus={() => setUnlocked(undefined)}
          fullWidth
        />
        <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(onSubmit)}>
          {t('actions.save')}
        </AppButton>
      </Stack>
      {user && (
        <ImageEditor
          width={250}
          height={250}
          rounded
          isOpen={isEditingImage}
          onClose={() => {
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
          <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('requests.updateData.headline')}
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('requests.updateData.confirm', { var: String(updates.map((update) => ` ${update[0]}`)) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={requestUpdates} color="error" variant="contained">
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog> */}
    </FormContainer>
  );
};

export default ProfileEditor;
