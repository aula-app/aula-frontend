import { changePassword } from '@/services/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  Collapse,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import AppIconButton from '../AppIconButton';
import AppIcon from '../AppIcon';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

// Password complexity configuration
export interface PasswordComplexity {
  minLength: number;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
}

interface Props {
  tmp_token?: string;
  disabled?: boolean;
  passwordComplexity?: PasswordComplexity;
}

interface ChangePasswordMethods {
  displayMessage: (isSuccess: boolean) => void;
}

/**
 * Renders User info with Avatar
 * @component ChangePassword
 */
const ChangePassword: React.FC<Props> = ({
  tmp_token,
  disabled = false,
  passwordComplexity = {
    minLength: 12,
    requireUppercase: false,
    requireNumber: false,
    requireSymbol: false,
  },
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();

  const [showMessage, setShowMessage] = useState(false);
  const [messageSuccess, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState<Record<keyof typeof fields, boolean>>({
    oldPassword: false,
    confirmPassword: false,
    newPassword: false,
  });

  const createPasswordValidation = () => {
    let validation = yup.string().required(t('forms.validation.required'));

    validation = validation.min(
      passwordComplexity.minLength,
      t('forms.validation.minLength', { var: passwordComplexity.minLength })
    );

    if (passwordComplexity.requireUppercase) {
      validation = validation.matches(/[A-Z]/, 'Password must contain at least one uppercase letter');
    }

    if (passwordComplexity.requireNumber) {
      validation = validation.matches(/[0-9]/, 'Password must contain at least one number');
    }

    if (passwordComplexity.requireSymbol) {
      validation = validation.matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
    }

    return validation.max(64, t('forms.validation.maxLength', { var: 64 }));
  };

  const schema = yup
    .object({
      oldPassword: yup
        .string()
        .required(t('forms.validation.required'))
        .min(4, t('forms.validation.minLength', { var: 4 }))
        .max(64, t('forms.validation.maxLength', { var: 64 })),
      newPassword: yup
        .string()
        .required(t('forms.validation.required'))
        .min(12, t('forms.validation.minLength', { var: 12 }))
        .max(64, t('forms.validation.maxLength', { var: 64 })),
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
  const { renderPasswordRequirements } = usePasswordRequirements(watchedNewPassword || '', passwordComplexity, t);

  const onSubmit = async (data: SchemaType) => {
    const result = await changePassword(data.oldPassword, data.newPassword, tmp_token);

    setShowMessage(true);
    setSuccess(!result.error);

    if (result.error) {
      // Check if we get the generic "no data" error during password change
      // This likely means the password validation failed
      if (result.error === t('errors.noData')) {
        // For password changes, this generic error usually means password doesn't meet requirements
        setErrorMessage(t('forms.validation.minLength', { var: 12 }));
      } else if (result.error.includes('Password must be at least') && result.error.includes('characters long')) {
        setErrorMessage(t('forms.validation.minLength', { var: 12 }));
      } else {
        setErrorMessage(result.error);
      }
    }

    if (tmp_token && !result.error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('auth.password.success'), type: 'success' } });
      navigate('/', { replace: true });
    }
  };

  const resetFields = () => {
    reset();
    setShowPassword({
      oldPassword: false,
      confirmPassword: false,
      newPassword: false,
    });
    setShowMessage(false);
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2} mt={2}>
        <Collapse in={showMessage}>
          <Alert
            variant="outlined"
            severity={messageSuccess ? 'success' : 'error'}
            onClose={() => setShowMessage(false)}
            data-testid={messageSuccess ? 'password-change-success' : 'password-change-error'}
            data-success={messageSuccess}
            data-expanded={showMessage}
          >
            {messageSuccess ? t('auth.password.success') : errorMessage || t('errors.invalidPassword')}
          </Alert>
        </Collapse>
        <Typography variant="h3">{t('auth.password.change')}</Typography>

        <Box
          sx={{
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            mb: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
            {t('auth.password.guidelines.title')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • {t('auth.password.guidelines.minLength')}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {t('auth.password.guidelines.hint')}
          </Typography>
        </Box>

        <Stack gap={1} direction="row" flexWrap="wrap">
          {(Object.keys(fields) as Array<keyof typeof fields>).map((field) => (
            <Box key={field} sx={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
              <TextField
                required
                disabled={disabled}
                type={showPassword[field] ? 'text' : 'password'}
                label={t(`auth.password.${field}`)}
                id={`change-password-${field}`}
                sx={{ width: '100%' }}
                {...register(field)}
                error={!!errors[field]}
                helperText={<span id={`${field}-error-message`}>{errors[field]?.message || ''}</span>}
                slotProps={{
                  htmlInput: {
                    'aria-labelledby': `change-password-${field}-label`,
                    'aria-invalid': !!errors[field],
                    'aria-errormessage': errors[field] ? `${field}-error-message` : undefined,
                    id: `change-password-${field}-label`,
                    htmlFor: `change-password-${field}`,
                    'data-testid': `${field}-input`,
                  },
                  input: {
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
                }}
              />
              {field === 'newPassword' && renderPasswordRequirements()}
            </Box>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="end" gap={2}>
          <Button color="error" disabled={disabled} onClick={resetFields}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" data-testid="submit-new-password" variant="contained" disabled={disabled}>
            {t('actions.save')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

// Export utility function for password requirements
export const usePasswordRequirements = (
  password: string,
  passwordComplexity: PasswordComplexity,
  t: (key: string, options?: any) => string
) => {
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });

  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= passwordComplexity.minLength,
      uppercase: passwordComplexity.requireUppercase ? /[A-Z]/.test(password) : true,
      number: passwordComplexity.requireNumber ? /[0-9]/.test(password) : true,
      symbol: passwordComplexity.requireSymbol ? /[^A-Za-z0-9]/.test(password) : true,
    });
  }, [
    password,
    passwordComplexity.minLength,
    passwordComplexity.requireUppercase,
    passwordComplexity.requireNumber,
    passwordComplexity.requireSymbol,
  ]);

  const renderPasswordRequirements = () => {
    const requirements = [
      {
        key: 'length',
        text: t('forms.validation.passwordMinLength', { count: passwordComplexity.minLength }),
        met: passwordRequirements.length,
        enabled: true,
      },
      {
        key: 'uppercase',
        text: t('forms.validation.passwordRequireUppercase'),
        met: passwordRequirements.uppercase,
        enabled: passwordComplexity.requireUppercase,
      },
      {
        key: 'number',
        text: t('forms.validation.passwordRequireNumber'),
        met: passwordRequirements.number,
        enabled: passwordComplexity.requireNumber,
      },
      {
        key: 'symbol',
        text: t('forms.validation.passwordRequireSymbol'),
        met: passwordRequirements.symbol,
        enabled: passwordComplexity.requireSymbol,
      },
    ].filter((req) => req.enabled);

    return (
      <Box sx={{ mt: 1 }}>
        <List dense sx={{ py: 0 }}>
          {requirements.map((requirement) => (
            <ListItem key={requirement.key} sx={{ py: 0, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {requirement.met ? (
                  <CheckIcon sx={{ color: '#4caf50', fontSize: '1.25rem' }} />
                ) : (
                  <CloseIcon sx={{ color: '#9e9e9e', fontSize: '1.25rem' }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={requirement.text}
                primaryTypographyProps={{
                  variant: 'caption',
                  color: requirement.met ? 'success.main' : 'text.secondary',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return { renderPasswordRequirements };
};

export default ChangePassword;
