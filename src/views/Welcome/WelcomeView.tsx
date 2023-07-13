import { CardMedia, Typography, capitalize } from '@mui/material';
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
         process.env.REACT_APP_API_URL + "/api/controllers/rooms.php"
        )
      ).json();

      // set state when the data received
      console.log(data)
      setData(data.data)
    };

    dataFetch();
    },[]);


  return (
    <Grid container spacing={1}>
      {data.map((d,i) =>
      <Grid key={d.id} item xs={12} md={4}>

      <AppLink to={ `/room/${ d.id }`} >
        <Card sx={{ borderRadius: '10px'}}>
          <CardContent>
          <Typography variant="h5" sx={{ mb: 1.5 }} noWrap>
            {capitalize(d.room_name)}
          </Typography>
          <CardMedia
              component="img"
              height="194"
              image={ (i%2 === 0) ? '/img/aula-room1.png' : 'img/aula-room.png' }
              alt="bg image"
            />
          <Typography sx={{ mt: 1.5 }} variant="body2" noWrap>
            {d.description_public}
          </Typography>
          </CardContent>
        </Card>

        </AppLink>
        </Grid>
        )
        }
    </Grid>
  );
};

export default WelcomeView;
