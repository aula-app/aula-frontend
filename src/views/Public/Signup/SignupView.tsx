import { useCallback, useState, useEffect, Fragment } from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  LinearProgress,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { AppButton, AppIconButton } from '@/components';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const schema = yup
  .object({
    email: yup.string().email().required(),
    phone: yup.string().trim().matches(/^$|[- .+()0-9]+$/, 'should contain numbers'),
    userName: yup.string().nonNullable().matches(/^[A-Za-z ]+$/, 'should contain only letters'),
    fullName: yup.string().nonNullable().matches(/^[A-Za-z ]+$/, 'should contain only letters'),
    password: yup.string().min(8).max(32).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    conditions: yup.boolean().oneOf([true],'You must agree to sign in.')
  })
  .required();

/**
 * Renders "Signup" view
 * url: /signup
 */
const SignupView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  if (loading) return <LinearProgress />;

  const steps = [
    {
      label: 'Login data',
      content: () => {
        return (
          <Fragment>
            <TextField
              required
              label="Email"
              {...register('email')}
              error={errors.email ? true : false}
              helperText={errors.email?.message || ' '}
            />
            <TextField
              required
              type={showPassword ? 'text' : 'password'}
              label="Password"
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
                      onClick={handleShowPasswordClick}
                      onMouseDown={e => e.preventDefault()}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {!showPassword && (
              <TextField
                required
                type="password"
                label="Confirm Password"
                {...register('confirmPassword')}
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword?.message || ' '}
              />
            )}
          </Fragment>
        );
      },
    },
    {
      label: 'Personal data',
      content: () => {
        return (
          <Fragment>
            <TextField
              required
              label="User Name"
              {...register('userName')}
              error={errors.userName ? true : false}
              helperText={errors.userName?.message || ' '}
            />
            <TextField
              required
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName ? true : false}
              helperText={errors.fullName?.message || ' '}
            />
            <TextField
              required
              label="Phone"
              {...register('phone')}
              error={errors.phone ? true : false}
              helperText={errors.phone?.message || ' '}
            />
          </Fragment>
        );
      },
    },
    {
      label: 'Terms of Use',
      content: () => {
        return (
          <FormControl required error={errors.password ? true : false}>
            <Box height={228} my={2} padding={2} border="1px solid #999" borderRadius={1} overflow='auto'>
              <Typography>Terms and Conditions</Typography>
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
          Sign Up
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
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
        {activeStep > 0 ? (
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          ) : ''
        }
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <AppButton type="submit" sx={{m: 0}}>
              Sign Up
            </AppButton>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Stack>
    </FormContainer>
  );
};

export default SignupView;
