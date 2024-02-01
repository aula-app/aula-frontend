import { Box, Stack } from '@mui/material';
import { localStorageGet } from '@/utils/localStorage';
import { useAppStore } from '@/store';
import { useEffect, useState, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router';
import ConsentDialog from '@/components/dialogs/ConsentDialog';

/**
 * Renders "Ask Consent" view
 * url: /
 */
const AskConsent = () => {
  const [, dispatch] = useAppStore();
  const jwt_token = localStorageGet('token');
  const [data, setData] = useState([] as any[]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const getData = await (
        await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/get_necessary_consents.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
        })
      ).json();

      // set state when the data received
      if (getData.count === 0) {
        dispatch({ type: 'HAS_CONSENT', payload: true });
        navigate('/');
      } else {
        dispatch({ type: 'HAS_CONSENT', payload: false });
        setData(getData.data);
      }
    };
    dataFetch();

  }, [dispatch, jwt_token, navigate]);


  return (
    <Box>
      <Stack alignItems="center">Loading</Stack>
      {data.length > 0 && <ConsentDialog data={data} />}
    </Box>
  );

};

export default AskConsent;
