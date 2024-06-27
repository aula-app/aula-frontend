import { Box, Stack } from '@mui/material';
import { databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ConsentDialog from '@/components/dialogs/ConsentDialog';
import { MessageConsentType, MessagesResponseType } from '@/types/MessageTypes';

/**
 * Renders "Ask Consent" view
 * url: /
 */
const AskConsent = () => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);

  const [, dispatch] = useAppStore();
  const [data, setData] = useState<MessageConsentType[]>([]);
  const navigate = useNavigate();

  const getData = async () =>
    await databaseRequest('model', {
      model: 'User',
      method: 'getMissingConsents',
      arguments: {
        user_id: jwt_payload.user_id
      },
    }).then((response) => {
      dispatch({ type: 'HAS_CONSENT', payload: response.count === 0 });
      if (response.count > 0) setData(response.data);
    });

  useEffect(() => {
    getData();
  }, [navigate]);

  return (
    <>
      {data && data.length > 0 && <ConsentDialog texts={data} />}
    </>
  );
};

export default AskConsent;
