import { Box, Button, ClickAwayListener, Divider, Paper, Stack, Typography, Zoom } from '@mui/material';
import AppIconButton from '../AppIconButton';
import AppIcon from '../AppIcon';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { ICONS } from '../AppIcon/AppIcon';
import { AlterTypes, ColorTypes } from '@/types/Generics';
import { useAppStore } from '@/store';
import { SettingsType } from '@/types/SettingsTypes';

interface OptionsTypes {
  type: AlterTypes;
  icon: keyof typeof ICONS;
  color: ColorTypes;
  label: string;
}

const options = [
  { type: 'edit', icon: 'edit', color: 'secondary', label: 'Edit' },
  { type: 'bug', icon: 'bug', color: 'warning', label: 'Report Bug' },
  { type: 'report', icon: 'report', color: 'error', label: 'Report Content' },
] as OptionsTypes[];

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions = ({}) => {
  const [state, dispatch] = useAppStore();
  const [open, setOpen] = useState(false);

  // @ts-ignore
  const toggleOptions = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleClick = (type: AlterTypes, element: SettingsType) => {
    setOpen(false);
    dispatch({ type: 'EDIT_DATA', payload: { type: type, element: element, id: 473 } })
  }
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
              <Box key={key}>
                <Button
                  color={option.color}
                  sx={{ width: '100%', justifyContent: 'start' }}
                  onClick={() => handleClick(option.type, 'boxes')}
                >
                  <Stack direction="row">
                    <AppIcon icon={option.icon} sx={{ mr: 1 }} />
                    <Typography noWrap>{option.label}</Typography>
                  </Stack>
                </Button>
                {key !== options.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Zoom>
      </ClickAwayListener>
    </Box>
  );
};

export default MoreOptions;
