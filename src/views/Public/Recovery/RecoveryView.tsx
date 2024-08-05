import { AppButton } from '@/components';
import { useAppStore } from '@/store';
import { ObjectPropByName } from '@/types/Generics';
import { localStorageGet } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, TextField, Typography } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 */
const RecoveryPasswordView = () => {
  const { t } = useTranslation();
  const jwt_token = localStorageGet("token");
  const [, dispatch] = useAppStore();
  const navigate = useNavigate()

  const schema = yup.object({
    email: yup.string().email(t("validation.email")).required(t("validation.required")),
  })
  .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: ObjectPropByName) => {
    const request = await (
      await fetch(
        `/controllers/forgot_password?email=${formData.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt_token,
          }        }
      )
    ).json();

    if (request.success === "false") {
      dispatch({ type: 'ADD_ERROR', message: t('generics.wrong') });
      return;
    }

    dispatch({ type: 'ADD_ERROR', message: t('login.forgotRequest') });
    navigate("/", { replace: true });
  }

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('login.recovery')}
        </Typography>
        <TextField
          required
          label="Email"
          {...register('email')}
          error={errors.email ? true : false}
          helperText={errors.email?.message || ' '}
        />
        <AppButton type="submit" onClick={handleSubmit(onSubmit)} sx={{ mx: 0 }}>
          {t('login.recover')}
        </AppButton>
      </Stack>
    </FormContainer>
  );
};

export default RecoveryPasswordView;
