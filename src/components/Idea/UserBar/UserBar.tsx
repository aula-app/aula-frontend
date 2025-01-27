import AppIconButton from '@/components/AppIconButton';
import MoreOptions from '@/components/MoreOptions';
import UserAvatar from '@/components/UserAvatar';
import { IdeaType } from '@/types/Scopes';
import { getDisplayDate } from '@/utils';
import { Stack, Typography } from '@mui/material';
import LikeButton from '../LikeButton';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
}

const UserBar: React.FC<Props> = ({ idea, disabled = false }) => {
  return (
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
      <MoreOptions item={idea} scope="ideas">
        <Stack direction="row" alignItems="center">
          <LikeButton disabled={disabled} idea={idea} />
          {idea.sum_comments > 0 && (
            <AppIconButton icon="chat" to={`/idea/${idea.hash_id}`}>
              {idea.sum_comments}
            </AppIconButton>
          )}
        </Stack>
      </MoreOptions>
    </Stack>
  );
};

export default UserBar;
