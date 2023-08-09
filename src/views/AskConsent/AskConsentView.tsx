import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MobileStepper,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { localStorageGet } from '../../utils/localStorage';
import { AppButton, AppIcon } from '../../components';
import { useAppStore } from '../../store';
import { useEffect, useState, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

/**
 * Renders "Ask Consent" view
 * url: /
 */
const AskConsent = () => {
  const [state, dispatch] = useAppStore();
  const jwt_token = localStorageGet('token');
  const [data, setData] = useState([] as any[]);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(process.env.REACT_APP_API_URL + '/api/controllers/get_necessary_consents.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
        })
      ).json();

      // set state when the data received
      if (data.count == 0) {
        dispatch({ type: 'HAS_CONSENT', payload: true });
        navigate('/');
      } else {
        dispatch({ type: 'HAS_CONSENT', payload: false });
        setData(data.data);
      }
    };

    dataFetch();
  }, []);

  // const revokeConsent = useCallback(
  //   async (text_id: number, text_idx: number) => {
  //     const revokeConsentReq = async () => {
  //       const data = await (
  //         await fetch(process.env.REACT_APP_API_URL + '/api/controllers/revoke_consent.php', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: 'Bearer ' + jwt_token,
  //           },
  //           body: JSON.stringify({ text_id: text_id }),
  //         })
  //       ).json();

  //       return data;
  //     };

  //     const revokeConsentResponse = await revokeConsentReq();
  //     // if (revokeConsentResponse.success && revokeConsentResponse.data == 1) {
  //     //   const newData = data.filter((e,i) =>  i !== text_idx)
  //     //   setData(newData)
  //     //   if (newData.length == 0) {
  //     //     navigate(0)
  //     //   }
  //     // }
  //     // await revokeConsentReq();
  //   },
  //   [data]
  // );

  const giveConsent = useCallback(
    async (text_id: number, text_idx: number) => {
      if (text_idx === data.length - 1) setActiveStep(() => text_idx - 1);

      const giveConsentReq = async () => {
        const data = await (
          await fetch(process.env.REACT_APP_API_URL + '/api/controllers/give_consent.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + jwt_token,
            },
            body: JSON.stringify({ text_id: text_id }),
          })
        ).json();

        return data;
      };

      const giveConsentResponse = await giveConsentReq();
      if (giveConsentResponse.success && giveConsentResponse.data === 1) {
        const newData = data.filter((e, i) => i !== text_idx);
        setData(newData);
        if (newData.length === 0) navigate(0);
      }
      // await giveConsentReq();
    },
    [data]
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      open={true}
      fullWidth={true}
      maxWidth="sm"
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          width: {xs: '100%', md: ' calc(100% - 64px)'},
          height: {xs: '100%', md: 'auto'},
          maxHeight: {xs: '100%', md: 'calc(100% - 64px)'},
          margin: {xs: 0, md: 2},
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
      {data.map((text, i) => (
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
                <AppButton color="primary" onClick={() => giveConsent(text.id, i)}>
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
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      )}
    </Dialog>
  );
};

export default AskConsent;
