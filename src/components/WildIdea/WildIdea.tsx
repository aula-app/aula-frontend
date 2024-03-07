import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';
import { Idea } from '@/types/IdeaType';

interface Props {
  idea: Idea;
}

export const WildIdea = ({ idea }: Props) => {

  const displayDate = new Date(idea.created);

  return (
    <Stack width="100%" mb={2} sx={{scrollSnapAlign: 'center'}}>
      <IdeaBubble text={idea.content} likes={idea.sum_likes} comments={0} />
      <Stack direction="row" alignItems="center" mt='-20px'>
        <AccountCircle sx={{ fontSize: '3em' }} />
        <Stack ml={1} maxWidth='100%' overflow='hidden'>
          <Typography variant="caption" lineHeight={1.5}>
            {displayDate.getFullYear()}/{displayDate.getMonth()}/{displayDate.getDate()}
          </Typography>
          <Typography
            variant="overline"
            overflow='hidden'
            textOverflow="ellipsis"
            fontWeight={700}
            lineHeight={1.5}
            maxWidth='100%'
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

export default WildIdea;
