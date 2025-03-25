import { AppIcon } from '@/components';
import { getNecessaryConsents, giveConsent, MessageConsentType } from '@/services/consent';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MobileStepper,
  Stack,
  Typography,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/**
 * Renders "Ask Consent" view
 * url: /
 */
const AskConsent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [data, setData] = useState<MessageConsentType[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const getData = async () => {
    const data = await getNecessaryConsents();

    setData(data ? data : []);
  };

  const consent = async (text_id: number) => {
    giveConsent(text_id).then(() => {
      getData();
      setActiveStep(0);
    });
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
      <Stack direction="row" height={52} alignItems="center" justifyContent="center">
        <img src={`${import.meta.env.VITE_APP_BASENAME}img/Aula_Icon.svg`} alt="aula" height="100%" />
        <Stack flexGrow={1} alignItems="center" justifyContent="center" mr={2}>
          <Typography fontWeight={700} textTransform="uppercase" color="secondary">
            Acknowledgement
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      {data.length > 0 &&
        data.map((text: MessageConsentType, i: number) => (
          <Fragment key={i}>
            {i === activeStep && (
              <Fragment>
                <DialogTitle>{text.headline}</DialogTitle>
                <DialogContent>
                  <DialogContentText>{text.body}</DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions>
                  {data.length > 1 && (
                    <>
                      <MobileStepper
                        variant="text"
                        steps={data.length}
                        position="static"
                        activeStep={activeStep}
                        sx={{ bgcolor: 'transparent', p: 1, mr: 'auto', width: '50%' }}
                        nextButton={
                          <Button size="small" onClick={handleNext} disabled={activeStep === data.length - 1}>
                            {t('ui.common.next')}
                            <AppIcon icon="arrowright" />
                          </Button>
                        }
                        backButton={
                          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <AppIcon icon="arrowleft" />
                            {t('ui.common.back')}
                          </Button>
                        }
                      />
                    </>
                  )}
                  {text.user_needs_to_consent < 2 && (
                    <Button color="secondary" sx={{ ml: 2 }}>
                      {t('ui.common.dismiss')}
                    </Button>
                  )}
                  {text.user_needs_to_consent > 0 && (
                    <Button variant="contained" onClick={() => consent(text.id)}>
                      {text.consent_text}
                    </Button>
                  )}
                </DialogActions>
              </Fragment>
            )}
          </Fragment>
        ))}
    </Dialog>
  );
};

export default AskConsent;
