import { Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Dispatch, SetStateAction } from 'react';
import { SIDEBAR_WIDTH } from '../config';
import SideBarContent from './SideBarContent';

interface Props {
  setReport: Dispatch<SetStateAction<'bug' | 'report' | undefined>>;
}

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBarFixed
 */
const SideBarFixed = ({ setReport, ...restOfProps }: Props) => {
  return (
    <Stack
      className="noPrint"
      sx={{
        height: '100%',
        borderRight: `1px solid ${grey[300]}`,
        width: SIDEBAR_WIDTH,
        display: { xs: 'none', md: 'flex' },
      }}
      {...restOfProps}
    >
      <SideBarContent isFixed setReport={setReport} />
    </Stack>
  );
};

export default SideBarFixed;
