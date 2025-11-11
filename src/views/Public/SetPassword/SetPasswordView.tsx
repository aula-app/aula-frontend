import { AppIconButton } from '@/components';
import AppIcon from '@/components/AppIcon';
import { getRuntimeConfig, loadRuntimeConfig, RuntimeConfig, RuntimeConfigNotFoundError } from '@/config';
import { localStorageGet, localStorageSet } from "@/utils";
import { validateAndSaveInstanceCode } from '@/services/instance';
import { checkPasswordKey, setPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { usePasswordRequirements, PasswordComplexity } from '@/components/ChangePassword/ChangePassword';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Collapse, InputAdornment, Stack, TextField, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';


const SetPasswordView = () => {
  const { t } = useTranslation();
  const { key } = useParams();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();

  // Password complexity settings
  const passwordComplexity: PasswordComplexity = {
    minLength: 12,
    requireUppercase: false,
    requireNumber: false,
    requireSymbol: false,
  };

  const [searchParams] = useSearchParams();
  if (searchParams.has('code')) {
    localStorageSet('code', searchParams.get('code'))
  }

  const [error, setError] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<keyof typeof fields, boolean>>({
    confirmPassword: false,
    newPassword: false,
  });

  const [isValid, setValid] = useState(true);

  const createPasswordValidation = () => {
    let validation = yup.string().required(t('forms.validation.required'));
    
    validation = validation.min(passwordComplexity.minLength, 
      t('forms.validation.minLength', { var: passwordComplexity.minLength }));
    
    if (passwordComplexity.requireUppercase) {
      validation = validation.matches(/[A-Z]/, 'Password must contain at least one uppercase letter');
    }
    
    if (passwordComplexity.requireNumber) {
      validation = validation.matches(/[0-9]/, 'Password must contain at least one number');
    }
    
    if (passwordComplexity.requireSymbol) {
      validation = validation.matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
    }
    
    return validation.max(32, t('forms.validation.maxLength', { var: 32 }));
  };

  const schema = yup
  .object({
    newPassword: createPasswordValidation(),
    confirmPassword: yup
      .string()
      .required(t('forms.validation.required'))
      .oneOf([yup.ref('newPassword')], t('forms.validation.passwordMatch')),
  })
  .required(t('forms.validation.required'));

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedNewPassword = useWatch({
    control,
    name: 'newPassword',
    defaultValue: '',
  });
  
  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;
  const fields = schema.fields;

  // Use shared password requirements function
  const { renderPasswordRequirements } = usePasswordRequirements(
    watchedNewPassword || '',
    passwordComplexity,
    t
  );

  const validateKey = async () => {
    if (!key) {
      setValid(false);
      return;
    }

    let runtimeConfig: RuntimeConfig;
    try {
      // load config from localStorage (cache)
      runtimeConfig = getRuntimeConfig();
    } catch (err) {
      // load config from envvars or from //public-config.json
      runtimeConfig = await loadRuntimeConfig();
    }

    // if this instance's BE api url is not defined
    if (!localStorageGet('api_url')) {
      if (runtimeConfig.IS_MULTI) {
        // get the instance api url based on the instance code
        await validateAndSaveInstanceCode(localStorageGet('code'));
      } else {
        // if SINGLE, reuse the "CENTRAL_API_URL" as this instance's BE api url
        localStorageSet('api_url', runtimeConfig.CENTRAL_API_URL);
      }
    }

    try {
      const response = await checkPasswordKey(key);
      if (response.error) {
        setValid(false);
      }
    } catch (error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      setValid(false);
    }
  };

  const onSubmit = async (data: SchemaType, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    
    if (!key)
      return

    const result = await setPassword(data.newPassword, key)

    if (result.error) {
      setError(t(result.error));
      return;
    }

    dispatch({ type: 'ADD_POPUP', message: { message: t('auth.password.success'), type: 'success' } });
    navigate("/", { replace: true });
  };

  const resetFields = () => {
    reset();
    setShowPassword({
      confirmPassword: false,
      newPassword: false,
    });
  };

  useEffect(() => {
    validateKey();
  }, [key]);

  return (
    <Stack gap={2}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate method="POST">
        <Stack gap={2}>
        <Typography variant="h2">{t('auth.password.set')}</Typography>
        <Collapse in={!isValid}>
          <Alert variant="outlined" severity="error" onClose={() => setValid(true)}>
            {t('errors.invalidCode')}
          </Alert>
        </Collapse>
        <Stack gap={2}>
          <Stack gap={1} direction="row" flexWrap="wrap">
            {(Object.keys(fields) as Array<keyof typeof fields>).map((field) => (
              <Box key={field} sx={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
                <TextField
                  required
                  type={showPassword[field] ? 'text' : 'password'}
                  label={t(`auth.password.${field}`)}
                  id={`set-password-${field}`}
                  sx={{ width: '100%' }}
                  {...register(field)}
                  error={!!errors[field]}
                  helperText={<span id={`${field}-error-message`}>{typeof errors[field]?.message === 'string' ? errors[field]?.message : ''}</span>}
                  slotProps={{
                    input: {
                      'aria-labelledby': `set-password-${field}-label`,
                      'aria-invalid': !!errors[field],
                      'aria-errormessage': errors[field] ? `${field}-error-message` : undefined,
                      endAdornment: (
                        <InputAdornment position="end">
                          <AppIconButton
                            aria-label="toggle password visibility"
                            icon={showPassword[field] ? 'visibilityOn' : 'visibilityOff'}
                            title={showPassword[field] ? t('actions.hide') : t('actions.show')}
                            onClick={() => setShowPassword({ ...showPassword, [field]: !showPassword[field] })}
                          />
                        </InputAdornment>
                      ),
                    },
                    inputLabel: {
                      id: `set-password-${field}-label`,
                      htmlFor: `set-password-${field}`,
                    },
                  }}
                />
                {field === 'newPassword' && renderPasswordRequirements()}
              </Box>
            ))}
          </Stack>

          <Stack direction="row" justifyContent="end" gap={2}>
            <Collapse in={showMessage}>
              <Alert
                variant="outlined"
                severity={!error ? 'success' : 'error'}
                onClose={() => setShowMessage(false)}
              >
                {!error ? t('auth.password.success') : t('errors.invalidPassword')}
              </Alert>
            </Collapse>
            <Button
              color="error"
              onClick={resetFields}
              aria-label={t('actions.cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              aria-label={t('actions.save')}
            >
              {t('actions.save')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      </form>
    </Stack>
  );
};

export default SetPasswordView;
