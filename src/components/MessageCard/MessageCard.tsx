import { AppIcon, AppIconButton, AppLink } from '@/components';
import FilterBar from '@/components/FilterBar';
import { getAnnouncements } from '@/services/announcements';
import { getPersonalMessages, getReports, getRequests } from '@/services/messages';
import { ObjectPropByName, StatusTypes } from '@/types/Generics';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  type: 'announcements' | 'messages' | 'reports' | 'requests';
}

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessageCard: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[] | AnnouncementType[]>([]);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [openMessagesFilter, setOpenMessagesFilter] = useState(false);

  const METHODS = {
    announcements: getAnnouncements,
    messages: getPersonalMessages,
    requests: getRequests,
    reports: getReports,
  } as Record<Props['type'], (args?: ObjectPropByName) => Promise<any>>;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const response = await METHODS[type]({
      status,
      search_field,
      search_text,
    });
    if (response.error) setError(response.error);
    if (!response.error && response.data) setMessages(response.data);
    setLoading(false);
  }, [type, status, search_field, search_text]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return isLoading ? (
    <Stack gap={1} mb={2}>
      <Stack direction="row" alignItems="center" gap={1} mb={1}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={180} />
      </Stack>
      <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 5 }} />
      <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 5 }} />
    </Stack>
  ) : (
    <>
      {messages.length > 0 && (
        <Stack gap={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h3" py={2} display="flex" alignItems="center">
              <AppIcon icon={type} sx={{ mr: 1 }} /> {t(`scopes.${type}.plural`)}
            </Typography>
          </Stack>
          {/* <AppIconButton icon="filter" onClick={() => setOpenMessagesFilter(!openMessagesFilter)} />
          <FilterBar
            scope={type}
            onStatusChange={(newStatus) => setStatus(newStatus)}
            onFilterChange={([field, text]) => {
              setSearchField(field);
              setSearchText(text);
            }}
          /> */}
          {messages.map((message) => {
            const variant = message.headline.substring(0, 3) === 'Bug' ? 'bugs' : type;
            return (
              <Stack
                key={message.id}
                component={AppLink}
                direction="row"
                alignItems="center"
                borderRadius={5}
                p={1}
                pl={2}
                to={`/${type}/${message.hash_id}`}
                bgcolor={`${variant}.main`}
              >
                <AppIcon icon={variant} />
                <Typography flex={1} px={2}>
                  {message.headline}
                </Typography>
                <AppIconButton size="small" icon="close" />
              </Stack>
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default MessageCard;
