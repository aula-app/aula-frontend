import { AccountCircle } from '@mui/icons-material';
import { Button, Stack, TextareaAutosize } from '@mui/material';

export const NewWildIdea = () => {
  return (
    <Stack p={2}>
      <Stack pb={2} direction="row">
        <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
        <Button variant="contained">Submit</Button>
      </Stack>
      <TextareaAutosize minRows={6} placeholder="What is your idea?" />
    </Stack>
  );
};

export default NewWildIdea;
