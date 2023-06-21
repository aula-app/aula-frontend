import { Typography, Box } from '@mui/material';
import { Stack } from '@mui/system';
import { Card, CardActions, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { AppButton } from '../../components';
import { AppLink } from '../../components';
import { localStorageGet } from '../../utils/localStorage';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';


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
          "/api/controllers/room_ideas.php",
          {
            method: 'POST', 
            headers: {                   
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'room_id': room_id })
          })).json();

      setData(data.data)
    };

    dataFetch();
    },[]);


  return (
    <Box sx={{ p: { md: 4, xs: 2} }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={12}>
        <Typography variant="h3" gutterBottom>
        { data.length } Ideas
        </Typography>
      </Grid>

       {data.map((d,i) => 
      <Grid item xs={12} md={12}>

      <AppLink to={ `/room/${ room_id }/idea/${ d.id }`} >
        <Card>
          <CardContent>
          {d.content}
          </CardContent>
        </Card>

        </AppLink>
        </Grid>
        )
        }
    </Grid>
    </Box>
  );
};

export default RoomView;
