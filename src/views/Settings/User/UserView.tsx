import { AppIcon } from '@/components';
import ChangePassword from '@/components/ChangePassword';
import { ChangePasswordMethods } from '@/components/ChangePassword/ChangePassword';
import { useAppStore } from '@/store';
import { PassResponse } from '@/types/Generics';
import { SingleUserResponseType } from '@/types/RequestTypes';
import { RequestBodyType, UserType } from '@/types/Scopes';
import { databaseRequest, localStorageGet } from '@/utils';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Stack } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileEditor from './ProfileEditor';

/** * Renders "User" view
 * url: /settings/user
 */
const UserView = () => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet('token');
  const api_url = localStorageGet('api_url');
  const [user, setUser] = useState<UserType | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [, dispatch] = useAppStore();
  const passFields = useRef<ChangePasswordMethods>(null);

  const getUserInfo = async () =>
    databaseRequest(
      {
        model: 'User',
        method: 'getUserBaseData',
        arguments: {},
      },
      ['user_id']
    ).then((response: SingleUserResponseType) => {
      if (response.success) setUser(response.data);
    });

  const changePass = (formData: PassResponse) => {
    if (!formData.oldPassword) return;
    setPass(formData.oldPassword, formData.newPassword);
  };

  const setPass = async (oldPass: string, newPass: string) => {
    const request = await (
      await fetch(`${api_url}/api/controllers/change_password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt_token,
        },
        body: JSON.stringify({
          password: oldPass,
          new_password: newPass,
        }),
      })
    ).json();

    if (!request.success) {
      passFields.current?.displayMessage(false);
      return;
    }

    passFields.current?.displayMessage(true);
  };

  const sendMessage = async (headline: string, body: RequestBodyType, returnMessage: string) =>
    await databaseRequest(
      {
        model: 'Message',
        method: 'addMessage',
        arguments: { headline, body: JSON.stringify(body), msg_type: 5 },
      },
      ['creator_id', 'updater_id']
    ).then((response) => {
      if (!response.success) return;
      setOpenDelete(false);
      dispatch({ type: 'ADD_POPUP', message: { message: returnMessage, type: 'success' } });
    });

  const requestExport = () => {
    if (!user) return;
    sendMessage(
      `Account data export request for ${user.realname}`,
      {
        type: 'requestData',
        data: { id: user.id, username: user.displayname, email: user.email },
        content: `A data export procedure was requested for user ${user.realname}, alias ${user.displayname}`,
      },
      t('texts.exportRequest')
    );
  };

  const requestDelete = () => {
    if (!user) return;
    sendMessage(
      `Account deletion request for ${user.realname}`,
      {
        type: 'deleteAccount',
        data: { id: user.id, username: user.displayname, email: user.email },
        content: `A data deletion procedure was requested for user ${user.realname}, alias ${user.displayname}`,
      },
      t('texts.deleteRequest')
    );
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4">{t('views.profile')}</Typography>
      {user && <ProfileEditor user={user} onReload={getUserInfo} />}
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('views.security')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePassword onSubmit={changePass} ref={passFields} />
        </AccordionDetails>
      </Accordion>
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
        <AccordionSummary
          expandIcon={<AppIcon icon="arrowdown" />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{
            backgroundColor: red[100],
          }}
        >
          <Typography variant="h6">{t('settings.danger')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" color="error" onClick={() => setOpenDelete(true)} fullWidth>
            {t('texts.deleteData')}
          </Button>
        </AccordionDetails>
      </Accordion>
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
