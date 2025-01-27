import { AlterTypes, ColorTypes } from '@/types/Generics';
import { ReportMetadataType, ScopeType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { ClickAwayListener, Collapse, Stack, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ICONS } from '../AppIcon/AppIcon';
import AppIconButton from '../AppIconButton';

interface OptionsTypes {
  type: AlterTypes;
  icon: keyof typeof ICONS;
  color: ColorTypes;
  label: string;
  otherData?: { headline?: string; body?: string; msg_type: number };
  metadata?: ReportMetadataType;
}

interface Props {
  item: ScopeType;
  scope: SettingNamesType;
  canEdit?: boolean;
  children?: React.ReactNode;
}

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions: React.FC<Props> = ({ item, scope, children, canEdit = false }) => {
  const { t } = useTranslation();
  // const location = useLocation();
  const [open, setOpen] = useState(false);
  // const [edit, setEdit] = useState<SettingNamesType>();
  // const [del, setDel] = useState(false);

  const defaultOptions = [
    { type: 'reports', icon: 'report', color: 'error', label: t('actions.contentReport') },
    { type: 'bugs', icon: 'bug', color: 'warning', label: t('actions.bugReport') },
  ] as OptionsTypes[];

  const editOptions = [
    { type: 'edit', icon: 'edit', color: 'secondary', label: t('actions.edit', { var: t(`scopes.${scope}.name`) }) },
    { type: 'delete', icon: 'delete', color: 'error', label: t('actions.delete') },
  ] as OptionsTypes[];

  const options = canEdit ? defaultOptions.concat(editOptions) : defaultOptions;

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const closeOptions = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    if (open) setOpen(false);
  };

  // const handleClick = (type: AlterTypes) => {
  //   setOpen(false);
  //   switch (type) {
  //     case 'delete':
  //       setDel(true);
  //       break;
  //     case 'edit':
  //       setEdit(scope);
  //       break;
  //     case 'add':
  //       setEdit(scope);
  //       break;
  //     default:
  //       setEdit(type);
  //       break;
  //   }
  // };

  // const close = () => {
  //   setEdit(undefined);
  //   setDel(false);
  //   onClose();
  // };

  // const formattedItem = toFormData(item);

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
