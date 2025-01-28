import { ScopeType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { ClickAwayListener, Collapse, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import BugButton from '../Buttons/BugButton';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import ReportButton from '../Buttons/ReportButton';

interface Props {
  item: ScopeType;
  scope: SettingNamesType;
  onDelete: () => void;
  onEdit: () => void;
  canEdit?: boolean;
  children?: React.ReactNode;
}

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions: React.FC<Props> = ({ item, scope, children, onDelete, onEdit, canEdit = false }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const closeOptions = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    if (open) setOpen(false);
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
                    onClick={() => handleClick(option.type)}
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
      {edit && (
        <EditData
          item={edit === 'report' || edit === 'bug' ? undefined : formattedItem}
          scope={edit}
          isOpen={!!edit}
          onClose={close}
          otherData={options.filter((data) => data.type === edit)[0]?.otherData}
          metadata={options.filter((data) => data.type === edit)[0]?.metadata}
        />
      )}
      {item.id && scope && <DeleteData id={item.id} scope={scope} isOpen={del} onClose={close} />}
    </>
  );
};

export default MoreOptions;
