import { Help } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ReactNode } from 'react';

interface Props {
  text: string; // Icon's name
  children: ReactNode;
}

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component KnowMore
 */
const KnowMore = ({ text, children }: Props) => {
  return (
    <Box position="relative">
      <Tooltip
        title={<Typography lineHeight={1.5} fontSize='small'>{text}</Typography>}
        arrow
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          color: grey[500],
          zIndex: 5,
        }}
      >
        <Box bgcolor="white" borderRadius={999} lineHeight={0}>
          <Help />
        </Box>
      </Tooltip>
      {children}
    </Box>
  );
};

export default KnowMore;
