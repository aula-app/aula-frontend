import ChangePassword from '@/components/ChangePassword';
import { ChangePasswordMethods } from '@/components/ChangePassword/ChangePassword';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout } from '@/hooks';
import { PassResponse } from '@/types/Generics';
import { localStorageGet, localStorageSet } from '@/utils';
import { Box, Button, Stack } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 */
const ChangePasswordView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const jwt_token = localStorageGet('token');
  const passFields = useRef<ChangePasswordMethods>(null);

  const onLogout = useEventLogout();

  const changePass = (formData: PassResponse) => {
    if (!formData.oldPassword) return;
    setPass(formData.oldPassword, formData.newPassword);
  };

  const setPass = async (oldPass: string, newPass: string) => {
    const request = await (
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/change_password.php`, {
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

    localStorageSet('token', request['JWT']);
    navigate('/', { replace: true });
  };

  return (
    <Stack mx="auto" width="100%" p={2} maxWidth="20rem" minHeight="100vh">
      <Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
          <Button color="primary" onClick={onLogout}>
            &lt; {t('login.button')}
          </Button>
          <LocaleSwitch />
        </Stack>
        <Box sx={{ width: '100%', mb: 2 }}>
          <img src="/logo-text.svg" alt="aula" />
        </Box>
      </Stack>
      <Stack
        flex={1}
        component="main"
        width="100%"
        sx={{
          padding: 1,
          justifyContent: 'center',
        }}
      >
        <ChangePassword onSubmit={changePass} ref={passFields} />
      </Stack>
    </Stack>
  );
};

export default ChangePasswordView;
