import { Backdrop, Box, Button, MobileStepper, Typography } from '@mui/material';
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
      if (giveConsentResponse.success && giveConsentResponse.data == 1) {
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
    <Backdrop open={true} sx={{ zIndex: 3000, bgcolor: '#fff' }}>
      <Stack width="100%" height="100%">
        <Stack direction="row" p={2}>
          <AppIcon icon="logo" />
          <Stack flexGrow={1} alignItems="center" justifyContent="center" mr={2}>
            <Typography fontWeight={700} textTransform="uppercase" color="secondary">
              Acknowledgement
            </Typography>
          </Stack>
        </Stack>
        <Stack flexGrow={1} p={2}>
          {data.map((text, i) => (
            <Fragment key={i}>
              {i === activeStep && (
                <Fragment>
                  <Typography variant="h5" p={1}>
                    {text.headline}
                  </Typography>
                  <Box overflow="auto" flexGrow={1} p={1}>
                    {text.body}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'end', pt: 2 }}>
                    <AppButton color="primary" onClick={() => giveConsent(text.id, i)}>
                      {text.consent_text}
                    </AppButton>
                  </Box>
                </Fragment>
              )}
            </Fragment>
          ))}
        </Stack>
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
      </Stack>
    </Backdrop>
  );
};

export default AskConsent;
