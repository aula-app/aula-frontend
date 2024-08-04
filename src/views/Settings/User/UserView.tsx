import { AppButton, AppIcon } from '@/components';
import ImageEditor from '@/components/ImageEditor';
import { useAppStore } from '@/store';
import { SingleUserResponseType } from '@/types/RequestTypes';
import { UserType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

/** * Renders "User" view
 * url: /settings/user
 */
const UserView = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserType | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [openDelete, setOpenDelete] = useState(false);
  const [, dispatch] = useAppStore();
  const [isEditingImage, setEditingImage] = useState<boolean>(false);

  const schema = yup
    .object({
      about_me: yup
        .string()
        .required(t('validation.required'))
        .min(4, t('validation.min', { var: 4 }))
        .max(32, t('validation.max', { var: 32 })),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const user_avatar = ''

  const getUserInfo = async () =>
    databaseRequest(
      {
        model: 'User',
        method: 'getUserBaseData',
        arguments: {},
      },
      ['user_id']
    ).then((response: SingleUserResponseType) => {
      setUser(response.data)
      downloadUserAvatar()
    });

  const downloadUserAvatar = () => {
      databaseRequest(
        {
          model: 'Media',
          method: 'userAvatar',
          arguments: {
            user_id: user.id
          }
        }).then((res:any) => {
        setUserAvatar(res.data[0].filename)
        });
  }

  const onSubmit = async (formData: Object) =>
    databaseRequest(
      {
        model: 'User',
        method: 'setUserAbout',
        arguments: formData,
      },
      ['user_id', 'updater_id']
    ).then(() => getUserInfo());

  const toggleDrawer = () => setEditingImage(!isEditingImage);

  const sendMessage = async (headline: string, body: string, returnMessage: string) =>
    await databaseRequest({
      model: 'Message',
      method: 'addMessage',
      arguments: { headline, body },
    }).then((response) => {
      if (!response.success) return;
      setOpenDelete(false);
      dispatch({ type: 'ADD_ERROR', message: returnMessage });
    });

  const requestExport = () => {
    if (!user) return;
    sendMessage(
      `Account data export request for ${user.realname} [#${user.id}]`,
      `A data data export procedure was requested for user ${user.realname}, alias ${user.displayname}`,
      t('texts.exportRequest')
    );
  };

  const requestDelete = () => {
    if (!user) return;
    sendMessage(
      `Account deletion request for ${user.realname} [#${user.id}]`,
      `A data deletion procedure was requested for user ${user.realname}, alias ${user.displayname}`,
      t('texts.deleteRequest')
    );
  };

  useEffect(() => {
    if (user) setValue('about_me', user.about_me);
  }, [user]);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4">{t('views.profile')}</Typography>
      {user && (
        <FormContainer>
          <Stack alignItems="center" p={2}>
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
              <Avatar
                sx={{
                  width: 128,
                  height: 128,
                  fontSize: '3rem',
                }}
                alt={user.displayname || 'User Name'}
                src={`${import.meta.env.VITE_APP_API_URL}/files/${userAvatar}` || ''}
              >
                {!userAvatar && <AppIcon icon="avatar" size="xl" />}
              </Avatar>
            </IconButton>
            <Typography sx={{ mt: 1 }} variant="h6">
              {user.username}
            </Typography>
            <Typography variant="body2">{user.displayname}</Typography>
            <Typography variant="body2">{user.email}</Typography>
            <TextField
              multiline
              minRows={5}
              label={t('settings.about_me')}
              {...register('about_me')}
              error={errors.about_me ? true : false}
              helperText={errors.about_me?.message || ' '}
              fullWidth
              sx={{ mt: 2 }}
            />
            <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(onSubmit)}>
              {t('generics.save')}
            </AppButton>
          </Stack>
        </FormContainer>
      )}
      {/* <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('views.security')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePassword onSubmit={(e) => console.log(e)} />
        </AccordionDetails>
      </Accordion> */}
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('views.privacy')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" color="info" onClick={requestExport} fullWidth>
            {t('texts.exportData')}
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('views.advanced')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" color="error" onClick={() => setOpenDelete(true)} fullWidth>
            {t('texts.deleteData')}
          </Button>
        </AccordionDetails>
      </Accordion>
      {user && (
        <ImageEditor
          isOpen={isEditingImage}
          closeMethod={() => { downloadUserAvatar(); toggleDrawer() }}
          currentImage={`${import.meta.env.VITE_APP_API_URL}/files/${userAvatar}` || '/img/aula_kopf.png'}
        />
      )}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography color="error" sx={{ display: 'flex' }}>
            <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('texts.deleteData')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('texts.deleteText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary" autoFocus>
            {t('generics.cancel')}
          </Button>
          <Button onClick={requestDelete} color="error" variant="contained">
            {t('generics.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default UserView;
