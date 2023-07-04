import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { styled } from '@mui/system';
import { buttonClasses } from '@mui/base/Button';
import { Card, CardActions, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { localStorageGet } from '../../utils/localStorage';
import { AppButton } from '../../components';
import { AppLink } from '../../components';
import { useAppStore } from '../../store';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router'

/**
 * Renders "Ask Consent" view
 * url: /
 */
const AskConsent = () => {
  const [state, dispatch] = useAppStore();
  const jwt_token = localStorageGet('token');
  const [data, setData] = useState([] as any[]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/controllers/get_necessary_consents.php",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
          },
        )
      ).json();

      // set state when the data received
      if (data.count == 0) {
        dispatch({type: 'HAS_CONSENT', payload: true})
        navigate('/')
      } else {
        dispatch({type: 'HAS_CONSENT', payload: false})
        setData(data.data)
      }
    };

    dataFetch();
    },[]);

  const giveConsent = useCallback(async (text_id:number, text_idx:number) => {
    const giveConsentReq = async () => {
      const data = await (
        await fetch(
          "/api/controllers/give_consent.php",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify({'text_id': text_id })
          },
        )
      ).json();

      return data;
    }

    const giveConsentResponse = await giveConsentReq();
    if (giveConsentResponse.success && giveConsentResponse.data == 1) {
      const newData = data.filter((e,i) =>  i !== text_idx)
      setData(newData)
      if (newData.length == 0) {
        navigate(0)
      }
    }
    // await giveConsentReq();
  }, [data])

  return (
    <Stack direction="column" spacing={2}>
        {data.map((text, i) =>
          <Card key={text.id}>
            <CardHeader title={text.headline}/>
            <CardContent>
            {text.body}
            </CardContent>
            <CardActions>
              <AppButton size="small" onClick={() => giveConsent(text.id, i)}>{text.consent_text}</AppButton>
            </CardActions>
          </Card>
            )
        }
  
    </Stack>
  );
};

export default AskConsent;
