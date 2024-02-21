import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { AppLink } from '..';
import phases from '@/utils/phases';
import { useParams } from 'react-router-dom';
import { CheckCircle, Cancel, WorkspacePremium } from '@mui/icons-material';
import { amber, grey, lightGreen, red } from '@mui/material/colors';

interface IdeaBoxProps {
  noCategories?: boolean;
  variant?: "discussion" | "approved" | "dismissed" | "voting" | "voted" | "rejected"
}

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if (displayPhases.includes('success')) displayPhases.splice(displayPhases.indexOf('success'), 1);
if (displayPhases.includes('reject')) displayPhases.splice(displayPhases.indexOf('reject'), 1);
if (displayPhases.includes('wild')) displayPhases.splice(displayPhases.indexOf('wild'), 1);
/**
 * Renders "Welcome" view
 * url: /
 */
const IdeaBox = ({ noCategories = false, variant = "discussion" }: IdeaBoxProps) => {
  //const CurrentIcon = phases.wild.icon;
  const params = useParams();

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        mb: 2,
        scrollSnapAlign: 'center',
        bgcolor:
        variant === "approved" ? amber[100] :
        variant === "voted" ? lightGreen[100] :
        variant === "dismissed" ? grey[100] :
        variant === "rejected" ? red[100] : 'transparent' }}
      variant="outlined">
      <AppLink to={`/room/${params.room_id}/idea-box/x`}>
        <Stack
          direction="row" height={68} alignItems="center">
          { variant !== "discussion" &&
          <Stack
            height="100%"
            alignItems="center"
            justifyContent="center"
            sx={{
              aspectRatio: 1,
              borderRight: '1px solid #ccc',
              color:
                variant === "approved" ? amber[400] :
                variant === "voted" ? lightGreen[400] :
                variant === "rejected" ? red[400] :
                grey[400]
            }}
          >
            { variant === "approved" && <WorkspacePremium fontSize="large" /> }
            { variant === "voted" && <CheckCircle fontSize="large" /> }
            { (variant === "dismissed" || variant === "rejected") && <Cancel fontSize="large" /> }
          </Stack>
          }
          <Stack flexGrow={1} px={2} overflow="hidden">
            <Typography variant="h6">TITLE</Typography>
            <Typography variant="body2" noWrap textOverflow="ellipsis">
              description lalalalalalalalalalalalallalaal
            </Typography>
          </Stack>
        </Stack>
      </AppLink>
    </Card>
  );
};

export default IdeaBox;
