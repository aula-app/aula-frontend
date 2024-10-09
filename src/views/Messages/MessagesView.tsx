import { AppIcon, AppIconButton } from '@/components';
import FilterBar from '@/components/FilterBar';
import MessageCard from '@/components/MessageCard';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { checkPermissions, databaseRequest, messageConsentValues, RequestObject } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [reports, setReports] = useState<MessageType[]>([]);
  const [requests, setRequests] = useState<MessageType[]>([]);
  const [openAnnouncementsFilter, setOpenAnnouncementsFilter] = useState(false);
  const [openMessagesFilter, setOpenMessagesFilter] = useState(false);
  const [openReportsFilter, setOpenReportsFilter] = useState(false);
  const [openRequestsFilter, setOpenRequestsFilter] = useState(false);
  const [announcementsFilter, setAnnouncementsFilter] = useState<[string, string]>(['', '']);
  const [messagesFilter, setMessagesFilter] = useState<[string, string]>(['', '']);
  const [reportsFilter, setReportsFilter] = useState<[string, string]>(['', '']);
  const [requestsFilter, setRequestsFilter] = useState<[string, string]>(['', '']);

  const announcementsFetch = async () => {
    const requestData = {
      model: 'Text',
      method: 'getTexts',
      arguments: {},
    } as RequestObject;

    if (!announcementsFilter.includes('')) {
      requestData['arguments']['search_field'] = announcementsFilter[0];
      requestData['arguments']['search_text'] = announcementsFilter[1];
    }

    await databaseRequest(requestData).then((response) => {
      if (response.success) setAnnouncements(response.data);
    });
  };

  const messagesFetch = async () => {
    const requestData = {
      model: 'Message',
      method: 'getPersonalMessagesByUser',
      arguments: {},
    } as RequestObject;

    if (!announcementsFilter.includes('')) {
      requestData['arguments']['search_field'] = announcementsFilter[0];
      requestData['arguments']['search_text'] = announcementsFilter[1];
    }

    await databaseRequest(requestData, ['user_id']).then((response) => {
      if (response.success) setMessages(response.data);
    });
  };

  const reportsFetch = async () => {
    const requestData = {
      model: 'Message',
      method: checkPermissions(40) ? 'getMessages' : 'getMessagesByUser',
      arguments: { msg_type: 4 },
    } as RequestObject;

    const getId = checkPermissions(40) ? [] : ['user_id'];

    if (!announcementsFilter.includes('')) {
      requestData['arguments']['search_field'] = announcementsFilter[0];
      requestData['arguments']['search_text'] = announcementsFilter[1];
    }

    await databaseRequest(requestData, getId).then((response) => {
      if (response.success) setReports(response.data);
    });
  };

  const requestsFetch = async () => {
    const requestData = {
      model: 'Message',
      method: 'getMessages',
      arguments: { msg_type: 5 },
    } as RequestObject;

    if (!announcementsFilter.includes('')) {
      requestData['arguments']['search_field'] = announcementsFilter[0];
      requestData['arguments']['search_text'] = announcementsFilter[1];
    }

    await databaseRequest(requestData).then((response) => {
      if (response.success) setRequests(response.data);
    });
  };

  useEffect(() => {
    messagesFetch();
  }, [messagesFilter]);

  useEffect(() => {
    reportsFetch();
  }, [reportsFilter]);

  useEffect(() => {
    requestsFetch();
  }, [requestsFilter]);

  useEffect(() => {
    announcementsFetch();
  }, [announcementsFilter]);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h5" py={2}>
        {t('views.messages')}
      </Typography>
      {messages.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="message" sx={{ mr: 1 }} /> {t('views.messages')}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenMessagesFilter(!openMessagesFilter)} />
          </Stack>
          <FilterBar
            isOpen={openMessagesFilter}
            filter={messagesFilter}
            scope="messages"
            setFilter={setMessagesFilter}
          />
          {messages.map((message) => (
            <MessageCard
              type="message"
              title={message.headline}
              to={`/messages/message/${message.id}`}
              key={message.id}
            />
          ))}
        </Stack>
      )}
      {announcements.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="announcement" sx={{ mr: 1 }} /> {t('views.announcements')}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenAnnouncementsFilter(!openAnnouncementsFilter)} />
          </Stack>
          <FilterBar
            scope="messages"
            filter={announcementsFilter}
            setFilter={setAnnouncementsFilter}
            isOpen={openAnnouncementsFilter}
          />

          {announcements.map((announcement) => (
            <MessageCard
              type={messageConsentValues[announcement.user_needs_to_consent]}
              title={announcement.headline}
              to={`/messages/announcement/${announcement.id}`}
              key={announcement.id}
            />
          ))}
        </Stack>
      )}
      {requests.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="alert" sx={{ mr: 1 }} /> {t('views.requests')}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenRequestsFilter(!openRequestsFilter)} />
          </Stack>
          <FilterBar scope="report" filter={requestsFilter} setFilter={setRequestsFilter} isOpen={openRequestsFilter} />
          {requests.map((request) => (
            <MessageCard
              type="request"
              title={request.headline}
              to={`/messages/request/${request.id}`}
              key={request.id}
            />
          ))}
        </Stack>
      )}
      {reports.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="report" sx={{ mr: 1 }} /> {t('views.reports')}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenReportsFilter(!openReportsFilter)} />
          </Stack>
          <FilterBar scope="report" filter={reportsFilter} setFilter={setReportsFilter} isOpen={openReportsFilter} />
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
    </Stack>
  );
};

export default MessagesView;
