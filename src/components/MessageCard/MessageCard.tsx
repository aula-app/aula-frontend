import { AppIcon, AppIconButton, AppLink } from '@/components';
import FilterBar from '@/components/FilterBar';
import { StatusTypes } from '@/types/Generics';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { checkPermissions, databaseRequest, RequestObject } from '@/utils';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  type: 'announcement' | 'message' | 'report' | 'request';
}

/**
 * Renders "Messages" view
 * url: /messages
 */

const METHODS = {
  announcement: 'getTexts',
  message: 'getPersonalMessagesByUser',
  report: checkPermissions(40) ? 'getMessages' : 'getMessagesByUser',
  request: 'getMessages',
} as Record<Props['type'], string>;

const MessageCard = ({ type }: Props) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageType[] | AnnouncementType[]>([]);
  const [status, setStatus] = useState<StatusTypes>(1);
  const [openMessagesFilter, setOpenMessagesFilter] = useState(false);
  const [messagesFilter, setMessagesFilter] = useState<[string, string]>(['', '']);

  const messagesFetch = async () => {
    const requestData = {
      model: type === 'announcement' ? 'Text' : 'Message',
      method: METHODS[type],
      arguments: { status: status },
    } as RequestObject;

    if (type === 'report') requestData.arguments['msg_type'] = 4;
    if (type === 'request') requestData.arguments['msg_type'] = 5;

    if (!messagesFilter.includes('')) {
      requestData['arguments']['search_field'] = messagesFilter[0];
      requestData['arguments']['search_text'] = messagesFilter[1];
    }

    const requestIds = [] as string[];
    if (type !== 'announcement' && !(type === 'report' && checkPermissions(40))) requestIds.push('user_id');

    await databaseRequest(requestData, requestIds).then((response) => {
      if (!response.success || !response.data) return;
      setLoading(false);
      setMessages(response.data);
    });
  };

  useEffect(() => {
    messagesFetch();
  }, [messagesFilter, status]);

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
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" py={2} display="flex" alignItems="center">
              <AppIcon icon={type} sx={{ mr: 1 }} /> {t(`views.${type}s`)}
            </Typography>
            <AppIconButton icon="filter" onClick={() => setOpenMessagesFilter(!openMessagesFilter)} />
          </Stack>
          <FilterBar
            isOpen={openMessagesFilter}
            filter={messagesFilter}
            scope="messages"
            setFilter={setMessagesFilter}
            setStatus={setStatus}
          />
          {messages.map((message) => {
            const variant = type === 'report' ? JSON.parse(message.body).data.type : type;
            return (
              <Stack
                key={message.id}
                component={AppLink}
                direction="row"
                alignItems="center"
                borderRadius={5}
                p={1}
                pl={2}
                mb={1}
                to={`/messages/${type}/${message.id}`}
                bgcolor={`${variant}.main`}
              >
                <AppIcon icon={variant} />
                <Typography flex={1} px={2}>
                  {type === 'report' && <>{t(`views.${variant}`)}:</>} {message.headline}
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
