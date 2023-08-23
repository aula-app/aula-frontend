import { Inbox, Lightbulb } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { localStorageGet } from '../../utils';
import { WildIdea } from '../../components/WildIdea';

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
  const jwt_token = localStorageGet('token');
  const room_id = params["room_id"];

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          process.env.REACT_APP_API_URL + "/api/controllers/room_ideas.php",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'room_id': room_id })
          })).json();

      console.log(data.data)
      setData(data.data)
    };

    dataFetch();
    }, []);

  const [value, setValue] = useState('0');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabPanel value='0' sx={{flexGrow: 1, p: 0}}>
        <Typography variant="h5" gutterBottom>
          {data.length} Ideas
        </Typography>
        {data.map((d,i) =>
          <WildIdea title={d.displayname} text={d.content} />
        )}
      </TabPanel>
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
