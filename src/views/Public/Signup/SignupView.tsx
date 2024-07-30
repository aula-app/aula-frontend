import { AppButton, AppIconButton } from '@/components';
import KnowMore from '@/components/KnowMore';
import { ObjectPropByName } from '@/types/Generics';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  LinearProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';


/**
 * Renders "Signup" view
 * url: /signup
 */
const SignupView = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const schema = yup
      .object({
        username: yup.string().nonNullable().matches(/^[A-Za-z ]+$/, t("validation.name")),
        fullname: yup.string().nonNullable().matches(/^[A-Za-z ]+$/, t("validation.name")),
        email: yup.string().email().required(t("validation.required")),
        password: yup.string().min(8, t("validation.min", { var: 8 })).max(32, t("validation.max", { var: 32 })).required(t("validation.required")),
        confirmPassword: yup.string().oneOf([yup.ref('password')], t("validation.verify")),
        conditions: yup.boolean().oneOf([true], t("validation.agree"))
      }).required()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleNext = (values: ObjectPropByName) => {
    schema.validate(values).then(
      () => {
        if (activeStep >= steps.length - 1) return;
        setActiveStep(activeStep + 1)
      }
    )
  };


  const onSubmit = (values: ObjectPropByName) => console.log(values);

  useEffect(() => {
    // Component Mount
    let componentMounted = true;

    async function fetchData() {
      //TODO: Call any Async API here
      if (!componentMounted) return; // Component was unmounted during the API call
      //TODO: Verify API call here

      setLoading(false); // Reset "Loading..." indicator
    }
    fetchData(); // Call API asynchronously

    return () => {
      // Component Un-mount
      componentMounted = false;
    };
  }, []);

  if (loading) return <LinearProgress />;

  const steps = [
    {
      label: 'Login data',
      content: () => {
        return (
          <Fragment key={0}>
            <TextField
              required
              label={t('login.userName')}
              {...register('username')}
              error={errors.username ? true : false}
              helperText={errors.username?.message || ' '}
            />
            <TextField
              required
              label={t('login.name')}
              {...register('fullname')}
              error={errors.fullname ? true : false}
              helperText={errors.fullname?.message || ' '}
            />
            <KnowMore text="Some info text.">
              <TextField
                required
                label={t('login.email')}
                {...register('email')}
                error={errors.email ? true : false}
                helperText={errors.email?.message || ' '}
                sx={{ width: '100%' }}
              />
            </KnowMore>
            <TextField
              required
              type={showPassword ? 'text' : 'password'}
              label={t('login.password')}
              {...register('password')}
              error={errors.password ? true : false}
              helperText={errors.password?.message || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label="toggle password visibility"
                      icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={e => e.preventDefault()}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              type={showConfirmPassword ? 'text' : 'password'}
              label={t('login.passwordConfirm')}
              {...register('confirmPassword')}
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword?.message || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label="toggle password visibility"
                      icon={showConfirmPassword ? 'visibilityon' : 'visibilityoff'}
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                      onClick={() => setConfirmPassword(!showConfirmPassword)}
                      onMouseDown={e => e.preventDefault()}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Fragment>
        );
      },
    },
    {
      label: 'Terms of Use',
      content: () => {
        return (
          <FormControl required error={errors.password ? true : false} key={2}>
            <Box height={228} my={2} padding={2} border="1px solid #999" borderRadius={1} overflow='auto'>
              <Typography>{t("login.terms")}</Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('conditions')} />
              }
              label="agree with Terms of Use and Privacy Policy"
            />
            <FormHelperText>{errors.password?.message || ' '}</FormHelperText>
          </FormControl>
        );
      },
    },
  ];

  return (
    <FormContainer>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t("login.signUp")}
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            return (
              <Step key={label.label} {...stepProps}>
                <StepLabel />
              </Step>
            );
          })}
        </Stepper>
        {steps[activeStep].content()}

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          {/* {activeStep > 0 ? (
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              {t("generics.back")}
            </Button>
          ) : ''
          } */}
          <Box sx={{ flex: '1 1 auto' }} />
          <AppButton type="submit" sx={{ m: 0 }} onClick={handleSubmit(activeStep === steps.length - 1 ? onSubmit : handleNext)}>
            {activeStep === steps.length - 1 ? t("login.sign") : t("generics.next")}
          </AppButton>
        </Box>
      </Stack>
    </FormContainer>
  );
};

export default SignupView;
