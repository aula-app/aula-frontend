import AppIcon from '@/components/AppIcon';
import AppLink from '@/components/AppLink';
import ChatBubble from '@/components/ChatBubble';
import UserAvatar from '@/components/UserAvatar';
import { IdeaType } from '@/types/Scopes';
import { getDisplayDate, phases } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import LikeButton from '../LikeButton';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
}

const IdeaBubble: React.FC<Props> = ({ idea, disabled = false }) => {
  const { phase } = useParams();

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={`${phases[Number(phase)]}.main`}>
        {/* <Stack direction="row" justifyContent="space-between">
            {ideaState.category ? (
              <Chip
                icon={<AppIcon icon={ideaState.category.description_internal} size="xs" sx={{ ml: 0.5 }} />}
                label={ideaState.category.name}
                variant="outlined"
                color="secondary"
              />
            ) : (
              <Box></Box>
            )}
            <MoreOptions
              scope="ideas"
              item={idea}
              onClose={onClose}
              canEdit={checkPermissions(30) || (checkPermissions(20) && checkSelf(idea.user_id))}
            />
          </Stack> */}
        <AppLink to={`/idea/${idea.hash_id}`} disabled={disabled}>
          <Stack gap={1}>
            <Typography variant="h6">{idea.title}</Typography>
            <Typography>{idea.content}</Typography>
            {/* {(Object.keys(fields) as Array<keyof CustomFieldsType>).map((customField) => (
                <Fragment key={customField}>
                  {fields[customField] && idea[customField] && (
                    <Typography mt={2}>
                      <b>{fields[customField]}:</b> {idea[customField]}
                    </Typography>
                  )}
                </Fragment>
              ))} */}
          </Stack>
        </AppLink>
      </ChatBubble>
      <Stack direction="row" alignItems="center">
        <UserAvatar id={String(idea.user_id)} />
        <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
          <Typography variant="caption" lineHeight={1.5}>
            {getDisplayDate(idea.created)}
          </Typography>
          <Typography
            variant="overline"
            overflow="hidden"
            textOverflow="ellipsis"
            fontWeight={700}
            lineHeight={1.5}
            maxWidth="100%"
          >
            {idea.displayname}
          </Typography>
        </Stack>
        {idea.sum_comments > 0 && (
          <AppLink to={`/idea/${idea.hash_id}`} disabled={disabled}>
            <Stack direction="row" alignItems="center">
              <AppIcon icon="chat" sx={{ mr: 0.5 }} />
              {idea.sum_comments}
            </Stack>
          </AppLink>
        )}
        <LikeButton idea={idea} />
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
