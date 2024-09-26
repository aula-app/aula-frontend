import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import RequestsManager from '@/views/Settings/Requests/RequestsManager';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "Report" view
 * url: /request
 */

const RequestView = () => {
  const params = useParams();
  const [request, setRequest] = useState<MessageType>();

  const requestFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessageBaseData',
      arguments: {
        message_id: params['message_id'],
      },
    }).then((response) => {
      if (!response.success) return;
      setRequest(response.data);
    });

  useEffect(() => {
    requestFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {request && <RequestsManager request={request} onReload={requestFetch} />}
    </Stack>
  );
};

export default RequestView;
