import { AccountCircle } from '@mui/icons-material';
import { localStorageGet } from '@/utils/localStorage';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useCallback } from 'react';

export const NewWildIdea = () => {

  const jwt_token = localStorageGet('token');

  const submitNewIdea = async () => {
    const data = await (
        await fetch(
          import.meta.env.VITE_APP_API_URL + '/api/controllers/add_idea.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
            body: JSON.stringify(
              {'content': 'test',
              'room_id': 2,
            })
          })).json();

        console.log(data)
  }

  return (
    <Stack p={2}>
      <Stack pb={2} direction="row">
        <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
        <Button variant="contained" onClick={submitNewIdea}>Submit</Button>
      </Stack>
      <Stack position='relative'>
        <TextField
          variant='filled'
          multiline
          minRows={6}
          placeholder="What is your idea?" />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '25px',
            border: `8px solid #eee`,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transformOrigin: 'bottom left',
            transform: 'translateY(-100%)'
          }}
          />
      </Stack>
    </Stack>
  );
};

export default NewWildIdea;
