import { AlterTypes, ColorTypes } from '@/types/Generics';
import { ReportMetadataType, ScopeType, toFormData } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { getCurrentUser } from '@/utils';
import { Box, Button, ClickAwayListener, Divider, Paper, Stack, Typography, Zoom } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AppIcon from '../AppIcon';
import { ICONS } from '../AppIcon/AppIcon';
import AppIconButton from '../AppIconButton';
import { DeleteData } from '../Data';
import EditData from '../Data/EditData';

interface OptionsTypes {
  type: AlterTypes;
  icon: keyof typeof ICONS;
  color: ColorTypes;
  label: string;
  otherData?: { headline?: string; body?: string; msg_type: number };
  metadata?: ReportMetadataType;
}

interface Props<T extends ScopeType> {
  item: T;
  scope: SettingNamesType;
  canEdit?: boolean;
  onClose: () => void;
}

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions = <T extends ScopeType>({ item, scope, canEdit = false, onClose }: Props<T>) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<SettingNamesType>();
  const [del, setDel] = useState(false);

  const defaultOptions = [
    {
      type: 'report',
      icon: 'report',
      color: 'error',
      label: t('generics.contentReport'),
      otherData: {
        headline: `${scope} #${item.id}`,
        msg_type: 4,
      },
      metadata: {
        type: 'report',
        location: location.pathname,
        user: getCurrentUser(),
      },
    },
    {
      type: 'bug',
      icon: 'bug',
      color: 'warning',
      label: t('generics.bugReport'),
      otherData: {
        headline: `${scope} #${item.id}`,
        msg_type: 4,
      },
      metadata: {
        type: 'bug',
        location: location.pathname,
        user: getCurrentUser(),
        userAgent: window.navigator.userAgent,
      },
    },
  ] as OptionsTypes[];

  const editOptions = [
    { type: 'edit', icon: 'edit', color: 'secondary', label: t('generics.edit') },
    { type: 'delete', icon: 'delete', color: 'error', label: t('generics.delete') },
  ] as OptionsTypes[];

  const options = defaultOptions.concat(canEdit ? editOptions : []);

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleClick = (type: AlterTypes) => {
    setOpen(false);
    switch (type) {
      case 'delete':
        setDel(true);
        break;
      case 'edit':
        setEdit(scope);
        break;
      case 'add':
        setEdit(scope);
        break;
      default:
        setEdit(type);
        break;
    }
  };

  const close = () => {
    setEdit(undefined);
    setDel(false);
    onClose();
  };

  const formattedItem = toFormData(item);

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
