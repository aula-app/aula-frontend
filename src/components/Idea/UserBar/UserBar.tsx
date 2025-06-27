import UserAvatar from '@/components/UserAvatar';
import { CommentType, IdeaType } from '@/types/Scopes';
import { useDateFormatters } from '@/utils';
import { Stack, Typography } from '@mui/material';

interface Props {
  info: IdeaType | CommentType;
  disabled?: boolean;
}

const UserBar: React.FC<Props> = ({ info, disabled = false }) => {
  const { formatDateTime } = useDateFormatters();
  return (
    <Stack direction="row" alignItems="center">
      <UserAvatar id={String(info.user_hash_id)} />
      <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
        <Typography variant="caption" lineHeight={1.5}>
          {formatDateTime(info.created)}
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
