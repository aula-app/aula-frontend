import { Box, Button, ClickAwayListener, Divider, Paper, Stack, Typography, Zoom } from '@mui/material';
import AppIconButton from '../AppIconButton';
import AppIcon from '../AppIcon';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { ICONS } from '../AppIcon/AppIcon';
import { ColorTypes } from '@/types/Generics';

interface OptionsTypes {
  icon: keyof typeof ICONS;
  color: ColorTypes;
  label: string;
}

const options = [
  { icon: 'edit', color: 'secondary', label: 'Edit' },
  { icon: 'bug', color: 'warning', label: 'Report Bug' },
  { icon: 'report', color: 'error', label: 'Report Content' },
] as OptionsTypes[];

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions = ({}) => {
  const [open, setOpen] = useState(false);
  // @ts-ignore
  const toggleOptions = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };
  return (
    <Box position="relative">
      <AppIconButton icon="more" onClick={toggleOptions} />
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Zoom in={open}>
          <Paper
            sx={{
              position: 'absolute',
              top: '75%',
              right: 0,
              borderRadius: 3,
              bgcolor: grey[100],
              zIndex: 50,
            }}
            elevation={3}
          >
            {options.map((option, key) => (
              <>
                <Button color={option.color} sx={{ width: '100%', justifyContent: 'start' }}>
                  <Stack direction="row">
                    <AppIcon icon={option.icon} sx={{ mr: 1 }} />
                    <Typography noWrap>{option.label}</Typography>
                  </Stack>
                </Button>
                {key !== options.length - 1 && <Divider />}
              </>
            ))}
          </Paper>
        </Zoom>
      </ClickAwayListener>
    </Box>
  );
};

export default MoreOptions;
