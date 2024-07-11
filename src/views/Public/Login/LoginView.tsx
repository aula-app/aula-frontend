import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  TextField,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useAppStore } from '@/store';
import { localStorageGet, localStorageSet, parseJwt } from '@/utils';
import { AppButton, AppLink, AppIconButton } from '@/components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormContainer, useForm } from 'react-hook-form-mui';

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required().min(4).max(32)
  })
  .required();

/**
 * Renders "Login" view for Login flow
 * url: /login/email
 */
const LoginView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const jwt_token = localStorageGet('token');
  const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;

  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);


  const onSubmit = async (formData: Object) => {

    const request = await (
      await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/controllers/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt_token
      },
      body: JSON.stringify(formData),
    })).json();

      localStorageSet('token', request['JWT']);
      dispatch({ type: 'LOG_IN' });
      navigate('/', { replace: true });
  }

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>
        <TextField
          required
          label="Username"
          inputProps={{ autoCapitalize: 'none' }}
          {...register('username')}
          error={errors.username ? true : false}
          helperText={errors.username?.message || ' '}
          sx={{ mt: 0 }}
        />
        <TextField
          required
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...register('password')}
          error={errors.password ? true : false}
          helperText={errors.password?.message || ' '}
          sx={{ mt: 0 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                  onClick={handleShowPasswordClick}
                  onMouseDown={(e => e.preventDefault())}
                />
              </InputAdornment>
            ),
          }}
        />
        <AppButton type="submit" color="primary" sx={{ mx: 0, mt: 0 }} onClick={handleSubmit(onSubmit)}>
          Sign In
        </AppButton>
        <Grid container justifyContent="end" alignItems="center">
          <Button variant="text" color="secondary" component={AppLink} to="/recovery/password">
            Forgot Password?
          </Button>
        </Grid>
      </Stack>
    </FormContainer>
  );
};

export default LoginView;