import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { styled } from '@mui/system';
import Tabs from '@mui/base/Tabs';
import TabsList from '@mui/base/TabsList';
import TabPanel from '@mui/base/TabPanel';
import Tab, { tabClasses } from '@mui/base/Tab';
import { buttonClasses } from '@mui/base/Button';
import { Card, CardActions, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { AppButton } from '../../components';
import { AppLink } from '../../components';
import { useEffect, useState } from 'react';

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledTab = styled(Tab)`
  font-family: IBM Plex Sans, sans-serif;
  color: #00c752;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px;
  margin: 6px 6px;
  border: none;
  border-width: 2px;
  border-color: #00c752;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #69f0ae;
  }

  &:focus {
    color: #fff;
  }

  &.${tabClasses.selected} {
    background-color: #00c752;
    color: #fff;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`;

const StyledTabsList = styled(TabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: transparent;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  `,
);

/**
 * Renders "Welcome" view
 * url: /
 */
const WelcomeView = () => {
  const [data, setData] = useState([] as any[]);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/controllers/rooms.php"
        )
      ).json();

      // set state when the data received
      console.log(data)
      setData(data.data)
    };

    dataFetch();
    },[]);


  return (
    <Tabs defaultValue={0}>
      <StyledTabsList>
        <StyledTab value={0}>Wild Ideas</StyledTab>
        <StyledTab value={1}>Idea Boxes</StyledTab>
      </StyledTabsList>
      <StyledTabPanel value={1}>List of Ideas Boxes</StyledTabPanel>
    <StyledTabPanel value={0}>
    <Grid container spacing={4}>
       {data.map((d,i) => 
      <Grid item xs={12} md={4}>

      <AppLink to={ `/room/${ d.id }`} >
        <Card sx={{ borderRadius: '10px'}}>
          <CardHeader title={d.room_name}/>
          <CardContent>
          <img src={ ( i % 2 == 0)?'/img/aula.png':'img/aula-room.png' }/>
          {d.description_public}
          </CardContent>
        </Card>

        </AppLink>
        </Grid>
        )
        }
    </Grid>
  </StyledTabPanel>

    </Tabs>
  );
};

export default WelcomeView;
