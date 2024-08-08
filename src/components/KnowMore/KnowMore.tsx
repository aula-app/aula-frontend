import { Help } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ReactNode } from 'react';
import AppIconButton from '../AppIconButton';

interface Props {
  title: string; // Icon's name
  children: ReactNode;
}

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component KnowMore
 */
const KnowMore = ({ title, children }: Props) => {
  return (
    <Box position="relative" display="inline-block">
      <Tooltip title={title} arrow>
        <AppIconButton
          icon="help"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate3d(75%,-30%,0)',
            color: grey[500],
            zIndex: 5,
          }}
        />
      </Tooltip>
      {children}
    </Box>
  );
};

export default KnowMore;
