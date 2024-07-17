import { Box, Button, ClickAwayListener, Divider, Paper, Stack, Typography, Zoom } from '@mui/material';
import AppIconButton from '../AppIconButton';
import AppIcon from '../AppIcon';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { ICONS } from '../AppIcon/AppIcon';
import { AlterTypes, ColorTypes } from '@/types/Generics';
import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import { useTranslation } from 'react-i18next';
import AlterData from '../AlterData';

interface OptionsTypes {
  type: AlterTypes;
  icon: keyof typeof ICONS;
  color: ColorTypes;
  label: string;
}

interface Props {
  scope: SettingNamesType;
  id: number;
  onClose: () => void;
}
/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions = ({ scope, id, onClose }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

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
    setEdit(true);
  };

  const closeEdit = () => {
    setEdit(false);
    onClose();
  };
  return (
    <>
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
                    onClick={() => handleClick(option.type, scope)}
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
      <AlterData id={id} scope={scope} isOpen={edit} onClose={closeEdit} />
    </>
  );
};

export default MoreOptions;
