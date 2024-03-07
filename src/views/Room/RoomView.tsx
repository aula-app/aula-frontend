import { Inbox, Lightbulb } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WildIdeasView from '@/views/WildIdeas';
import IdeasBoxesView from '@/views/IdeasBoxes';
import { databaseRequest } from '@/utils/requests';

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
  const params = useParams();
  const [data, setData] = useState([] as any[]);

  const dataFetch = async () => await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
      decrypt: ['displayname', 'content']
    });

  const updateData = () => dataFetch().then((response) => setData(response.data));
  useEffect(() => { updateData() }, []);

  const [value, setValue] = useState('0');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  return (
    <Stack width="100%" height="100%" overflow="hidden">
      <TabContext value={value}>
        <TabPanel value="0" sx={{ flexGrow: 1, p: 1, pt: 2, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <WildIdeasView data={data} reload={updateData} />
        </TabPanel>
        <TabPanel value="1" sx={{ flexGrow: 1, p: 1, pt: 2, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <IdeasBoxesView />
        </TabPanel>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
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
              },
            }}
          >
            <Tab
              value="0"
              icon={
                <Stack direction="row" alignItems="center">
                  <Lightbulb sx={{ mr: 1 }} />
                  {data.length}
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
    </Stack>
  );
};

export default RoomView;
