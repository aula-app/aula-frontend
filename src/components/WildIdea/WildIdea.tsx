import { AccountCircle } from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';
import { IdeaBubble } from '../IdeaBubble';
import AppLink from '../AppLink';

interface IdeaBubbleProps {
  title?: string;
  text: string;
  id: string;
}

export const WildIdea = ({ title, text, id }: IdeaBubbleProps) => {
  return (
    <AppLink to={`idea/${id}`} mb={2}>
      <IdeaBubble title={title} text={text} />
      <Stack direction="row" alignItems="center">
        <AccountCircle sx={{ fontSize: '3em' }} />
        <Stack ml={1}>
          <Typography variant="caption" lineHeight={1.5}>
            date
          </Typography>
          <Typography variant="overline" fontWeight={700} lineHeight={1.5}>
            username
          </Typography>
        </Stack>
        <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
          <Chip label="category" color="warning" />
        </Stack>
      </Stack>
    </AppLink>
  );
};

export default WildIdea;
