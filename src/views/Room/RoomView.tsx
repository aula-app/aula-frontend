import { Inbox, Lightbulb } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

/**
 * Renders "Room" view
 * url: /
 */
const RoomView = () => {
  const [value, setValue] = useState('0');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabPanel value='0' sx={{flexGrow: 1}}>Wild Ideas</TabPanel>
      <TabPanel value='1' sx={{flexGrow: 1}}>Idea Boxes</TabPanel>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="Tabbed Navigation"
          sx={{
            '.MuiTabs-indicator': {
              top: 0,
              bottom: 'auto',
            }
          }}>
          <Tab
            value="0"
            icon={
              <Stack direction="row" alignItems="center">
                <Lightbulb sx={{ mr: 1 }} />3
              </Stack>
            }
            label="Wild Ideas"
            {...a11yProps(0)}
          />
          <Tab
            value="1"
            icon={
              <Stack direction="row" alignItems="center">
                <Inbox sx={{ mr: 1 }} />3
              </Stack>
            }
            label="Idea Boxes"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
    </TabContext>
  );
};

export default RoomView;
