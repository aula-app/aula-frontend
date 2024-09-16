import { AppButton, AppIcon } from '@/components';
import ImageEditor from '@/components/ImageEditor';
import UserAvatar from '@/components/UserAvatar';
import { useAppStore } from '@/store';
import { ObjectPropByName } from '@/types/Generics';
import { UserType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

/** * Renders "SystemSettings" component
 */

interface Props {
  user: UserType;
  onReload: () => void;
}

const SystemSettings = ({ user, onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [isEditingImage, setEditingImage] = useState<boolean>(false);
  const [updateAvatar, setUpdateAvatar] = useState(false);

  const schema = yup.object({
    about_me: yup.string(),
    displayname: yup.string().max(30, 'validation.max'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
          message: { message: t('texts.updated', { var: t(`settings.${Object.keys(args)[0]}`) }), type: 'success' },
        });
      onReload();
    });
  };

  const updateUserInfo = (formData: Record<string, string>) => {
    const methods = {
      about_me: 'setUserAbout',
      displayname: 'setUserDisplayname',
    } as Record<string, string>;
    Object.keys(formData).map((form) => {
      setUserInfo(methods[form], { [form]: formData[form] });
    });
  };

  const toggleDrawer = () => {
    setUpdateAvatar(!updateAvatar);
    setEditingImage(!isEditingImage);
  };

  useEffect(() => {
    setValue('about_me', user.about_me);
    setValue('displayname', user.displayname);
  }, [user]);

  return (
    <FormContainer>
      <Stack alignItems="center" p={2} gap={1}>
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
        <Typography variant="h6">{user.realname}</Typography>
        <Typography variant="body2">{user.email}</Typography>
        <Typography variant="body2">{user.username}</Typography>
        <TextField
          label={t('settings.displayname')}
          {...register('displayname')}
          error={errors.displayname ? true : false}
          helperText={errors.displayname?.message || ' '}
          fullWidth
          slotProps={{ inputLabel: { shrink: !!user.displayname } }}
          sx={{ mt: 2 }}
        />
        <TextField
          multiline
          minRows={5}
          label={t('settings.about_me')}
          {...register('about_me')}
          error={errors.about_me ? true : false}
          helperText={errors.about_me?.message || ' '}
          fullWidth
        />
        <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(updateUserInfo)}>
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
    </FormContainer>
  );
};

export default SystemSettings;
