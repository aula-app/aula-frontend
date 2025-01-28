import { Stack } from '@mui/material';
import { memo } from 'react';
import { fixedSideBarStyles } from './styles';
import { BaseSideBarProps } from './types';
import SideBarContent from './SideBarContent';

/**
 * Renders fixed SideBar with Menu and User details for desktop view
 * @component SideBarFixed
 * @param {BaseSideBarProps} props - Component props
 * @returns {JSX.Element} Rendered SideBarFixed component
 */
const SideBarFixed = ({ ...restOfProps }: BaseSideBarProps): JSX.Element => {
  return (
    <Stack className="noPrint" sx={fixedSideBarStyles} {...restOfProps}>
      <SideBarContent isFixed />
    </Stack>
  );
};

export default memo(SideBarFixed);
