import { Stack } from '@mui/material';
import { memo } from 'react';
import { fixedSideBarStyles } from './styles';
import SideBarContent from './SideBarContent';

/**
 * Renders fixed SideBar with Menu and User details for desktop view
 * @component SideBarFixed
 * @returns {JSX.Element} Rendered SideBarFixed component
 */
const SideBarFixed = ({ ...restOfProps }): JSX.Element => {
  return (
    <Stack className="noPrint" sx={fixedSideBarStyles} {...restOfProps}>
      <SideBarContent isFixed />
    </Stack>
  );
};

export default memo(SideBarFixed);
