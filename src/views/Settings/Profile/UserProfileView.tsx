import { AppIcon } from '@/components';
import ChangePassword from '@/components/ChangePassword';
import { ChangePasswordMethods } from '@/components/ChangePassword/ChangePassword';
import { useAppStore } from '@/store';
import { PassResponse } from '@/types/Generics';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileEditor from './ProfileEditor';
import ProfileEditorSkeleton from './ProfileEditor/ProfileEditorSkeleton';
import { getSelf } from '@/services/users';

/** * Renders "User" view
 * url: /settings/user
 */
const UserView = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType>();

  // const [openDelete, setOpenDelete] = useState(false);
  // const [, dispatch] = useAppStore();
  // const passFields = useRef<ChangePasswordMethods>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const response = await getSelf();
    if (response.error) setError(response.error);
    if (!response.error && response.data) setUser(response.data);
    setLoading(false);
  }, []);

  // const changePass = (formData: PassResponse) => {
  //   if (!formData.oldPassword) return;
  //   setPass(formData.oldPassword, formData.newPassword);
  // };

  // const setPass = async (oldPass: string, newPass: string) => {
  //   const request = await (
  //     await fetch(`${api_url}/api/controllers/change_password.php`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + jwt_token,
  //       },
  //       body: JSON.stringify({
  //         password: oldPass,
  //         new_password: newPass,
  //       }),
  //     })
  //   ).json();

  //   if (!request.success) {
  //     passFields.current?.displayMessage(false);
  //     return;
  //   }

  //   passFields.current?.displayMessage(true);
  // };

  // const sendMessage = async (headline: string, body: RequestBodyType, returnMessage: string) =>
  //   await databaseRequest(
  //     {
  //       model: 'Message',
  //       method: 'addMessage',
  //       arguments: { headline, body: JSON.stringify(body), msg_type: 5 },
  //     },
  //     ['creator_id', 'updater_id']
  //   ).then((response) => {
  //     if (!response.success || !response.data) return;
  //     setOpenDelete(false);
  //     dispatch({ type: 'ADD_POPUP', message: { message: returnMessage, type: 'success' } });
  //   });

  // const requestExport = () => {
  //   if (!user) return;
  //   sendMessage(
  //     `${user.realname}`,
  //     {
  //       data: { type: 'requestData', id: user.id, username: user.displayname, email: user.email },
  //       content: '',
  //     },
  //     t('settings.account.exportRequest')
  //   );
  // };

  // const requestDelete = () => {
  //   if (!user) return;
  //   sendMessage(
  //     `${user.realname}`,
  //     {
  //       data: { type: 'deleteAccount', id: user.id, username: user.displayname, email: user.email },
  //       content: '',
  //     },
  //     t('settings.account.deleteRequest')
  //   );
  // };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4">{t('ui.navigation.profile')}</Typography>
      {isLoading && <ProfileEditorSkeleton />}
      {error && <Typography>{t(error)}</Typography>}
      {user && !isLoading && <ProfileEditor user={user} onReload={fetchProfile} />}
      {/* <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('ui.navigation.security')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePassword onSubmit={changePass} ref={passFields} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<AppIcon icon="arrowdown" />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">{t('ui.navigation.privacy')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" color="info" onClick={requestExport} fullWidth>
            {t('settings.account.export')}
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
          <Typography variant="h6">{t('settings.panels.danger')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button variant="contained" color="error" onClick={() => setOpenDelete(true)} fullWidth>
            {t('requests.deleteAccount.button')}
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
            <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('requests.deleteAccount.button')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">{t('requests.deleteAccount.confirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={requestDelete} color="error" variant="contained">
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog> */}
    </Stack>
  );
};

export default UserView;
