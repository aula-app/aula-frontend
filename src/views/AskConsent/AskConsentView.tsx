import { AppButton, AppIcon } from '@/components';
import { localStorageGet, MessageConsentType } from '@/utils';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MobileStepper,
  Stack,
  Typography,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Renders "Ask Consent" view
 * url: /
 */
const AskConsent = () => {
  const jwt_token = localStorageGet('token');
  const api_url = localStorageGet('api_url');
  const location = useLocation();
  const [data, setData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const getData = async () => {
    const data = await (
      await fetch(api_url + '/api/controllers/get_necessary_consents.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt_token,
        },
      })
    ).json();

    setData(data.data != 0 ? data.data : []);
  };

  const giveConsent = async (text_id: number) => {
    const data = await (
      await fetch(api_url + '/api/controllers/give_consent.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt_token,
        },
        body: JSON.stringify({ text_id: text_id }),
      })
    ).json();

    getData();
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    getData();
  }, [location]);
  return (
    <Dialog
      open={data.length > 0}
      fullWidth={true}
      maxWidth="sm"
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          width: { xs: '100%', md: ' calc(100% - 64px)' },
          height: { xs: '100%', md: 'auto' },
          maxHeight: { xs: '100%', md: 'calc(100% - 64px)' },
          margin: { xs: 0, md: 2 },
        },
      }}
    >
      <Stack direction="row" p={2} pb={0}>
        <AppIcon icon="logo" />
        <Stack flexGrow={1} alignItems="center" justifyContent="center" mr={2}>
          <Typography fontWeight={700} textTransform="uppercase" color="secondary">
            Acknowledgement
          </Typography>
        </Stack>
      </Stack>
      {data.length > 0 &&
        data.map((text: MessageConsentType, i: number) => (
          <Fragment key={i}>
            {i === activeStep && (
              <Fragment>
                <DialogTitle>{text.headline}</DialogTitle>
                <DialogContent>
                  <DialogContentText>{text.body}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" sx={{ ml: 2 }}>
                    Cancel
                  </Button>
                  <AppButton color="primary" onClick={() => giveConsent(text.id)}>
                    {text.consent_text}
                  </AppButton>
                </DialogActions>
              </Fragment>
            )}
          </Fragment>
        ))}
      {data.length > 1 && (
        <MobileStepper
          variant="text"
          steps={data.length}
          position="static"
          activeStep={activeStep}
          sx={{ bgcolor: 'transparent', p: 1 }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === data.length - 1}>
              Next
              <AppIcon icon="arrowright" />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <AppIcon icon="arrowleft" />
              Back
            </Button>
          }
        />
      )}
    </Dialog>
  );
};

export default AskConsent;
