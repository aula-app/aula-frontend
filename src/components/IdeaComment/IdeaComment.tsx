import { AccountCircle } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';

interface IdeaBubbleProps {
  title?: string;
  text: string;
  id: string;
}

export const WildIdea = ({ title, text, id }: IdeaBubbleProps) => {
  return (
    <Stack>
      <IdeaBubble isComment title={title} text={text} />
      <Stack direction="row" alignItems="center" mt='-20px'>
        <AccountCircle sx={{ fontSize: '2em' }} />
        <Stack ml={1}>
          <Typography variant="caption" lineHeight={1.5}>
            date
          </Typography>
          <Typography variant="overline" fontWeight={700} lineHeight={1.5}>
            username
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WildIdea;
