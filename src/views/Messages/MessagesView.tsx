import { AppIcon, AppIconButton } from '@/components';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { checkPermissions, databaseRequest, messageConsentValues } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterBar from '../Settings/SettingsView/FilterBar';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [openMessageFilter, setOpenMessageFilter] = useState(false);
  const [openReportFilter, setOpenReportFilter] = useState(false);
  const [messageFilter, setMessageFilter] = useState<[string, string]>(['', '']);
  const [reportFilter, setReportFilter] = useState<[string, string]>(['', '']);

  const reportFetch = async () =>
    await databaseRequest(
      {
        model: 'Message',
        method: checkPermissions(40) ? 'getMessages' : 'getMessagesByUser',
        arguments: {
          extra_where: !reportFilter.includes('') ? ` AND ${reportFilter[0]} LIKE '%${reportFilter[1]}%'` : '',
        },
      },
      checkPermissions(40) ? [] : ['user_id']
    ).then((response) => {
      if (!response.success) return;
      setReports(response.data);
    });

  const messageFetch = async () =>
    await databaseRequest({
      model: 'Text',
      method: 'getTexts',
      arguments: {
        extra_where: !messageFilter.includes('') ? ` AND ${messageFilter[0]} LIKE '%${messageFilter[1]}%'` : '',
      },
    }).then((response) => {
      if (!response.success) return;
      setMessages(response.data);
    });

  useEffect(() => {
    reportFetch();
  }, [reportFilter]);

  useEffect(() => {
    messageFetch();
  }, [messageFilter]);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h5" py={2}>
        {t('views.messages')}
      </Typography>
      {reports.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="message" sx={{ mr: 1 }} /> {t('views.reports')}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenReportFilter(!openReportFilter)} />
          </Stack>
          <FilterBar scope="report" filter={reportFilter} setFilter={setReportFilter} isOpen={openReportFilter} />
          {reports.map((report) => (
            <MessageCard
              type={
                report.headline.substring(0, 3) === 'Bug'
                  ? 'bug'
                  : report.headline.substring(0, 7) === 'Account'
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
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="message" sx={{ mr: 1 }} /> {t('views.messages')}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenMessageFilter(!openMessageFilter)} />
          </Stack>
          <FilterBar scope="messages" filter={messageFilter} setFilter={setMessageFilter} isOpen={openMessageFilter} />

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
