import { Box } from '@mui/material';
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
      <AppIconButton
        icon="help"
        title={title}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          transform: 'translate3d(75%,-50%,0)',
          color: grey[500],
          zIndex: 5,
        }}
      />
      {children}
    </Box>
  );
};

export default KnowMore;
