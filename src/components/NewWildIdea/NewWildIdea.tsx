import { AccountCircle } from '@mui/icons-material';
import { Box, Button, Stack, TextField } from '@mui/material';

export const NewWildIdea = () => {
  return (
    <Stack p={2}>
      <Stack pb={2} direction="row">
        <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
        <Button variant="contained">Submit</Button>
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
