import { Inbox, Lightbulb } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WildIdeasView from '@/views/WildIdeas';
import IdeasBoxesView from '@/views/IdeasBoxes';
import { databaseRequest } from '@/utils/requests';
import { IdeasResponseType } from '@/types/IdeaTypes';
import { BoxesResponseType } from '@/types/BoxTypes';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

/**
 * Renders "Room" view
 * url: /room/:room_id
 */
const RoomView = () => {
  const params = useParams();
  const [ideas, setIdeas] = useState({} as IdeasResponseType);
  const [boxes, setBoxes] = useState({} as BoxesResponseType);

  const ideasFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
      decrypt: ['displayname', 'content'],
    });

  const boxesFetch = async () =>
    await databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicsByRoom',
      arguments: { room_id: Number(params['room_id']) },
      decrypt: ['name', 'description_public'],
    });

  const updateIdeas = () => ideasFetch().then((response) => setIdeas(response));
  const updateBoxes = () => boxesFetch().then((response) => setBoxes(response));

  useEffect(() => {
    updateIdeas();
    updateBoxes();
  }, []);

  const [value, setValue] = useState('0');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Stack width="100%" height="100%" overflow="hidden">
      <TabContext value={value}>
        <TabPanel value="0" sx={{ flexGrow: 1, p: 1, pt: 2, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <WildIdeasView ideas={ideas.data || []} reload={updateIdeas} />
        </TabPanel>
        <TabPanel value="1" sx={{ flexGrow: 1, p: 1, pt: 2, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <IdeasBoxesView boxes={boxes.data || []} />
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
                  {String(ideas.count)}
                </Stack>
              }
              label="Wild Ideas"
              {...a11yProps(0)}
            />
            <Tab
              value="1"
              icon={
                <Stack direction="row" alignItems="center">
                  <Inbox sx={{ mr: 1 }} />
                  {String(boxes.count)}
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
