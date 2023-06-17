import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Card, CardActions, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { AppButton } from '../../components';
import { AppLink } from '../../components';
import { useEffect, useState } from 'react';


/**
 * Renders "Room" view
 * url: /
 */
const RoomView = () => {
  const [data, setData] = useState([] as any[]);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/rooms.php"
        )
      ).json();

      // set state when the data received
      console.log(data)
      setData(data)
    };

    dataFetch();
    },[]);


  return (
    <Grid container spacing={4}>
       {data.map((d,i) => 
      <Grid item xs={12} md={4}>

      <AppLink to={ `/room/${ d.id }`} >
        <Card>
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
  );
};

export default RoomView;
