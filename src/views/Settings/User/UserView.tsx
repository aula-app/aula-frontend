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
import { Stack } from '@mui/system';
import { databaseRequest } from '@/utils';
import { useEffect, useState } from 'react';
import { SingleUserResponseType, UserType } from '@/types/Scopes';
import ChangePassword from '@/components/ChangePassword';
import { AppButton, AppIcon } from '@/components';
import { FormContainer } from 'react-hook-form-mui';
import { grey } from '@mui/material/colors';
import ImageEditor from '@/components/ImageEditor';
import { useAppStore } from '@/store';
import { useTranslation } from 'react-i18next';

/** * Renders "User" view
 * url: /user
 */
const UserView = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserType | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [, dispatch] = useAppStore();
  const [isEditingImage, setEditingImage] = useState<boolean>(false);

  const getUserInfo = async () =>
    databaseRequest(
      {
        model: 'User',
        method: 'getUserBaseData',
        arguments: {},
      },
      ['user_id']
    ).then((response: SingleUserResponseType) => setUser(response.data));

  const onSubmit = (formData: Object) => console.log(formData);
  const toggleDrawer = () => setEditingImage(!isEditingImage);

  const requestDelete = () => {
    setOpenDelete(false);
    dispatch({ type: 'ADD_ERROR', message: t('texts.deleteRequest') });
  };

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
                src={user.avatar || ''}
              >
                {!user.avatar && <AppIcon icon="avatar" size="xl" />}
              </Avatar>
            </IconButton>
            <Typography sx={{ mt: 1 }} variant="h6">
              {user.username}
            </Typography>
            <Typography variant="body2">{user.displayname}</Typography>
            <TextField
              disabled
              label="Email"
              inputProps={{ autoCapitalize: 'none' }}
              defaultValue={user.email}
              sx={{ mt: 2, width: '100%' }}
            />
            <TextField
              multiline
              minRows={5}
              label="About me"
              inputProps={{ autoCapitalize: 'none' }}
              defaultValue={user.about_me}
              sx={{ mt: 2, width: '100%' }}
            />
            <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={onSubmit}>
              {t('generics.save')}
            </AppButton>
          </Stack>
        </FormContainer>
      )}
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('views.security')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePassword />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('views.privacy')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="contained"
            color="info"
            onClick={() => dispatch({ type: 'ADD_ERROR', message: t('texts.exportRequest') })}
            fullWidth
          >
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
          closeMethod={toggleDrawer}
          currentImage={user.avatar || '/img/aula_kopf.png'}
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
