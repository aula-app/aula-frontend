import { AccountCircle } from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';

interface IdeaBubbleProps {
  username: string;
  text: string;
}

export const WildIdea = ({ username, text }: IdeaBubbleProps) => {
  return (
    <Stack mb={2} mx={1} sx={{scrollSnapAlign: 'center'}}>
      <IdeaBubble text={text} />
      <Stack direction="row" alignItems="center">
        <AccountCircle sx={{ fontSize: '3em' }} />
        <Stack ml={1} maxWidth='50%' overflow='hidden'>
          <Typography variant="caption" lineHeight={1.5}>
            date
          </Typography>
          <Typography
            variant="overline"
            overflow='hidden'
            textOverflow="ellipsis"
            fontWeight={700}
            lineHeight={1.5}
            maxWidth='100%'
            >
            {username}
          </Typography>
        </Stack>
        <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
          <Chip label="category" color="warning" />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WildIdea;
