import { Box, BoxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ReactNode } from 'react';
import AccessibleTooltip from '../AccessibleTooltip/AccessibleTooltip';
import AppIconButton from '../AppIconButton';

interface Props extends BoxProps {
  title: string; // Icon's name
  children: ReactNode;
}

/**
 * Renders question mark badge that reveals a tooltip on hover, focus or tap.
 * @component KnowMore
 */
const KnowMore: React.FC<Props> = ({ title, children, ...restOfProps }) => {
  return (
    <Box position="relative" display="inline-block" {...restOfProps}>
      {/* enterTouchDelay={0}: reveal on tap instead of requiring a long-press on touch devices */}
      <AccessibleTooltip title={title} arrow enterTouchDelay={0} leaveTouchDelay={3000}>
        <AppIconButton
          icon="help"
          aria-label={title}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate3d(50%,-50%,0)',
            color: grey[500],
            zIndex: 5,
          }}
        />
      </AccessibleTooltip>
      {children}
    </Box>
  );
};

export default KnowMore;
