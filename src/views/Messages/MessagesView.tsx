import { AppIcon, AppIconButton } from '@/components';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { checkPermissions, databaseRequest, messageConsentValues } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterBar from '../Settings/SettingsView/FilterBar';
import { STATUS } from '@/components/Data/EditData/DataConfig/formDefaults';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [reports, setReports] = useState<MessageType[]>([]);
  const [announcements, setAnnouncements] = useState<MessageType[]>([]);
  const [openAnnouncementsFilter, setOpenAnnouncementsFilter] = useState(false);
  const [openMessagesFilter, setOpenMessagesFilter] = useState(false);
  const [openReportFilter, setOpenReportFilter] = useState(false);
  const [announcementsFilter, setAnnouncementsFilter] = useState<[string, string]>(['', '']);
  const [messagesFilter, setMessagesFilter] = useState<[string, string]>(['', '']);
  const [reportFilter, setReportFilter] = useState<[string, string]>(['', '']);

  const statusOptions = [{ label: 'status.all', value: -1 }, ...STATUS];

  const announcementsFetch = async () =>
    await databaseRequest({
      model: 'Text',
      method: 'getTexts',
      arguments: {
        extra_where: !announcementsFilter.includes('')
          ? ` AND ${announcementsFilter[0]} LIKE '%${announcementsFilter[1]}%'`
          : '',
      },
    }).then((response) => {
      if (!response.success) return;
      setAnnouncements(response.data);
    });

  const messagesFetch = async () =>
    await databaseRequest(
      {
        model: 'Message',
        method: checkPermissions(40) ? 'getMessages' : 'getMessagesByUser',
        arguments: {
          status: 1,
          extra_where: !reportFilter.includes('') ? ` AND ${reportFilter[0]} LIKE '%${reportFilter[1]}%'` : '',
        },
      },
      checkPermissions(40) ? [] : ['user_id']
    ).then((response) => {
      if (!response.success) return;
      setMessages(response.data);
    });

  const reportsFetch = async () =>
    await databaseRequest(
      {
        model: 'Message',
        method: checkPermissions(40) ? 'getMessages' : 'getMessagesByUser',
        arguments: {
          status: 4,
          extra_where: !reportFilter.includes('') ? ` AND ${reportFilter[0]} LIKE '%${reportFilter[1]}%'` : '',
        },
      },
      checkPermissions(40) ? [] : ['user_id']
    ).then((response) => {
      if (!response.success) return;
      setReports(response.data);
    });

  useEffect(() => {
    messagesFetch();
  }, [reportFilter]);

  useEffect(() => {
    reportsFetch();
  }, [reportFilter]);

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
            scope="messages"
            filter={messagesFilter}
            setFilter={setMessagesFilter}
            isOpen={openMessagesFilter}
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
      {reports.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon="report" sx={{ mr: 1 }} /> {t('views.reports')}
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

          {announcements.map((message) => (
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
