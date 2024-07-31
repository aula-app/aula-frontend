import { IconButton, Stack, Typography } from '@mui/material';
import { AppIcon, AppLink } from '..';

/**
 * Renders "ReportCard" component
 */

interface Props {
  type: 'bug' | 'report' | 'alert';
  title: string;
  to: string;
}

const ReportCard = ({ type, title, to }: Props) => {
  return (
    <Stack
      component={AppLink}
      direction="row"
      alignItems="center"
      borderRadius={5}
      p={1}
      pl={2}
      mb={1}
      border={1}
      to={to}
      // color={messageConfig[type].color[800]}
    >
      <AppIcon icon={type} />
      <Typography flex={1} px={2}>
        {title}
      </Typography>
    </Stack>
  );
};

export default ReportCard;
