import { Accordion, AccordionDetails, AccordionSummary, Avatar, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { localStorageGet } from '@/utils/localStorage';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils/requests';
import { parseJwt } from '@/utils/jwt';
import { UserResponseType, UserType } from '@/types/UserTypes';
import { ArrowDropDown } from '@mui/icons-material';
import ChangePassword from '@/components/ChangePassword';
import { AppButton } from '@/components';
import { FormContainer } from 'react-hook-form-mui';

/** * Renders "User" view
 * url: /user
 */
const UserView = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);

  const getUserInfo = async () =>
    databaseRequest('model', {
      model: 'User',
      method: 'getUserBaseData',
      arguments: { user_id: jwt_payload.user_id },
      decrypt: ['displayname', 'username', 'email', 'about_me'],
    }).then((response: UserResponseType) => setUser(response.data));

  const onSubmit = (formData: Object) => console.log(formData);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Stack width="100%" height="100%" sx={{ overflowY: 'auto' }} p={2}>
      <Typography variant="h4">
        User Settings
      </Typography>
      {user && (
        <FormContainer>
          <Stack alignItems="center" p={2}>
            <Avatar
              sx={{
                width: 128,
                height: 128,
                fontSize: '3rem',
              }}
              alt={user.displayname || 'User Avatar'}
              src={user.avatar || '/img/Aula_Logo_Kopf.svg'}
            />
            <Typography sx={{ mt: 1 }} variant="h6">
              {user.username}
            </Typography>
            <Typography variant="body2">{user.displayname}</Typography>
            <TextField
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
              Save changes
            </AppButton>
          </Stack>
        </FormContainer>
      )}
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDown />} aria-controls="panel2-content" id="panel2-header">
          <Typography variant="h6">Advanced Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePassword />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default UserView;
