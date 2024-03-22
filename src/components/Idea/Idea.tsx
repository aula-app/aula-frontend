import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';
import { IdeaType } from '@/types/IdeaTypes';
import { useParams } from 'react-router-dom';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
  onReload?: () => void;
}

export const Idea = ({ idea, disabled = false, onReload = () => {} }: Props) => {
  const params = useParams();
  const displayDate = new Date(idea.created);

  return (
    <Stack width="100%" mb={2} sx={{ scrollSnapAlign: 'center' }} className="separateBottom">
      <IdeaBubble bubbleInfo={idea} id={Number(params['idea_id'])} onReload={onReload} disabled={disabled} />
      <Stack direction="row" alignItems="center" mt="-20px">
        <AccountCircle sx={{ fontSize: '3em' }} />
        <Stack ml={1} maxWidth="100%" overflow="hidden">
          <Typography variant="caption" lineHeight={1.5}>
            {displayDate.getFullYear()}/{displayDate.getMonth()}/{displayDate.getDate()}
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
        {/* <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
          <Chip label="category" color="warning" />
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default Idea;
