import AppIconButton from '@/components/AppIconButton';
import MoreOptions from '@/components/MoreOptions';
import UserAvatar from '@/components/UserAvatar';
import { CommentType, IdeaType } from '@/types/Scopes';
import { checkPermissions, checkSelf, getDisplayDate } from '@/utils';
import { Stack, Typography } from '@mui/material';
import LikeButton from '../LikeButton';

interface Props {
  info: IdeaType | CommentType;
  disabled?: boolean;
}

const UserBar: React.FC<Props> = ({ info, disabled = false }) => {
  return (
    <Stack direction="row" alignItems="center">
      <UserAvatar id={String(info.user_id)} />
      <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
        <Typography variant="caption" lineHeight={1.5}>
          {getDisplayDate(info.created)}
        </Typography>
        <Typography
          variant="overline"
          overflow="hidden"
          textOverflow="ellipsis"
          fontWeight={700}
          lineHeight={1.5}
          maxWidth="100%"
        >
          {info.displayname}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default UserBar;
