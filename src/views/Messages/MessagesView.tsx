import { AppIcon, AppLink } from '@/components';
import MessageCard from '@/components/MessageCard';
import ReportCard from '@/components/ReportCard';
import { MessageType } from '@/types/Scopes';
import { databaseRequest, messageConsentValues } from '@/utils';
import { IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const reportFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessages',
      arguments: {},
    }).then((response) => {
      if (!response.success) return;
      setReports(response.data);
    });

  const messageFetch = async () =>
    await databaseRequest({
      model: 'Text',
      method: 'getTexts',
      arguments: {},
    }).then((response) => {
      if (!response.success) return;
      setMessages(response.data);
    });

  useEffect(() => {
    reportFetch();
    messageFetch();
  }, []);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" py={2}>
          {t('views.messages')}
        </Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {reports.length > 0 && (
        <Stack>
          <Typography variant="h6" py={2} display="flex" alignItems="center">
            <AppIcon icon="report" sx={{ mr: 1 }} /> {t('views.reports')}
          </Typography>
          {reports.map((report) => (
            <ReportCard
              type={
                report.headline.substring(0, 3) === 'Bug'
                  ? 'bug'
                  : report.headline.substring(0, 7) !== 'Account'
                    ? 'alert'
                    : 'report'
              }
              title={report.headline}
              to={`/messages/report/${report.id}`}
              key={report.id}
            />
          ))}
        </Stack>
      )}
      {messages.length > 0 && (
        <Stack>
          <Typography variant="h6" py={2} display="flex" alignItems="center">
            <AppIcon icon="message" sx={{ mr: 1 }} /> {t('views.messages')}
          </Typography>
          {messages.map((message) => (
            <MessageCard
              type={messageConsentValues[message.user_needs_to_consent]}
              title={message.headline}
              to={`/messages/message/${message.id}`}
              key={message.id}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default MessagesView;
