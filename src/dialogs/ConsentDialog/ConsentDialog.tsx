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
import { AppButton, AppIcon } from '@/components';
import { localStorageGet, MessageConsentType } from '@/utils';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * Makes an Acknowledgement requiring consent inside the Dialog.
 * @component ConsentDialog
 */

const ConsentDialog = ({ texts }: { texts: MessageConsentType[] }) => {
  const jwt_token = localStorageGet('token');
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<MessageConsentType[]>([]);
  const navigate = useNavigate();

  const giveConsent = useCallback(
    async (text_id: number, text_idx: number) => {
      if (text_idx === data.length - 1) setActiveStep(() => text_idx - 1);

      const giveConsentReq = async () => {
        const getData = await (
          await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/give_consent.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + jwt_token,
            },
            body: JSON.stringify({ text_id: text_id }),
          })
        ).json();

        return getData;
      };

      const giveConsentResponse = await giveConsentReq();
      if (giveConsentResponse.success && giveConsentResponse.data === 1) {
        const newData = data.filter((e, i) => i !== text_idx);
        setData(newData);
        if (newData.length === 0) navigate(0);
      }
      // await giveConsentReq();
    },
    [data, navigate]
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
      {texts.map((text: MessageConsentType, i: number) => (
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
      {texts.length > 1 && (
        <MobileStepper
          variant="text"
          steps={texts.length}
          position="static"
          activeStep={activeStep}
          sx={{ bgcolor: 'transparent', p: 1 }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === texts.length - 1}>
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

export default ConsentDialog;
