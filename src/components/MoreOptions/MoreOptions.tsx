import { Box, Button, ClickAwayListener, Divider, Paper, Stack, Typography, Zoom } from '@mui/material';
import AppIconButton from '../AppIconButton';
import AppIcon from '../AppIcon';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { ICONS } from '../AppIcon/AppIcon';
import { AlterTypes, ColorTypes } from '@/types/Generics';
import { useAppStore } from '@/store';
import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import { useTranslation } from 'react-i18next';

interface OptionsTypes {
  type: AlterTypes;
  icon: keyof typeof ICONS;
  color: ColorTypes;
  label: string;
}

interface Props {
  element: SettingNamesType;
  id: number;
  onClose?: () => void;
}
/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions = ({ element, id, onClose }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [open, setOpen] = useState(false);
  const options = [
    { type: 'edit', icon: 'edit', color: 'secondary', label: t('generics.edit') },
    { type: 'bug', icon: 'bug', color: 'warning', label: t('generics.bugReport') },
    { type: 'report', icon: 'report', color: 'error', label: t('generics.contentReport') },
  ] as OptionsTypes[];

  // @ts-ignore
  const toggleOptions = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleClick = (type: AlterTypes, element: SettingNamesType) => {
    setOpen(false);
    dispatch({ type: 'EDIT_DATA', payload: { type: type, element: element, id: id, onClose: onClose } });
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
              <Box key={key}>
                <Button
                  color={option.color}
                  sx={{ width: '100%', justifyContent: 'start' }}
                  onClick={() => handleClick(option.type, element)}
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
