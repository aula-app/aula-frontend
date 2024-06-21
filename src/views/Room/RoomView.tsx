import { TabContext, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WildIdeasView from '@/views/WildIdeas';
import IdeasBoxesView from '@/views/IdeasBoxes';
import { databaseRequest } from '@/utils';
import { IdeasResponseType } from '@/types/IdeaTypes';
import { BoxesResponseType } from '@/types/BoxTypes';
import { AppIcon } from '@/components';
import { grey } from '@mui/material/colors';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

type TabOptions = 'ideas' | 'boxes';

/**
 * Renders "Room" view
 * url: /room/:room_id
 */
const RoomView = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState({} as IdeasResponseType);
  const [boxes, setBoxes] = useState({} as BoxesResponseType);
  const [tab, setTab] = useState<TabOptions>('ideas');
  
  const updateTab = () => setTab(location.pathname.split('/')[location.pathname.split('/').length - 1] === 'boxes' ? 'boxes' : 'ideas');

  const ideasFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeasByRoom',
      arguments: { room_id: Number(params['room_id']) },
    }).then((response) => setIdeas(response));

  const boxesFetch = async () =>
    await databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicsByRoom',
      arguments: { room_id: Number(params['room_id']) },
    }).then((response) => setBoxes(response));

  useEffect(() => {
    ideasFetch();
    boxesFetch();
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: TabOptions) => {
    navigate(`/room/${params['room_id']}/${newValue}`);
    setTab(newValue);
  };

  useEffect(() => updateTab(), [location])

  return (
    <Stack width="100%" height="100%" overflow="hidden">
      <TabContext value={tab}>
        <TabPanel value="ideas" sx={{ flexGrow: 1, p: 1, pt: 2, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <WildIdeasView ideas={ideas.data || []} reload={ideasFetch} />
        </TabPanel>
        <TabPanel value="boxes" sx={{ flexGrow: 1, p: 1, pt: 2, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <IdeasBoxesView boxes={boxes.data || []} />
        </TabPanel>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="Tabbed Navigation"
            sx={{
              bgcolor: grey[200],
              '.MuiTabs-indicator': {
                top: 0,
                bottom: 'auto'
              },
              '.MuiTab-labelIcon': {
                textTransform: 'none'
              }
            }}
          >
            <Tab
              value="ideas"
              icon={
                <Stack direction="row" alignItems="center">
                  <AppIcon name="idea" />
                  {String(ideas.count)}
                </Stack>
              }
              label="Wild Ideas"
              {...a11yProps(0)}
            />
            <Tab
              value="boxes"
              icon={
                <Stack direction="row" alignItems="center">
                  <AppIcon name="box" />
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
