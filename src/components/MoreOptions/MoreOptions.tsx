import { AlterTypes, ColorTypes } from '@/types/Generics';
import { ReportMetadataType, ScopeType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { ClickAwayListener, Collapse, Stack, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ICONS } from '../AppIcon/AppIcon';
import AppIconButton from '../AppIconButton';
import ReportButton from '../Buttons/ReportButton';
import BugButton from '../Buttons/BugButton';
import EditButton from '../Buttons/EditButton';
import DeleteButton from '../Buttons/DeleteButton';

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

  return (
    <ClickAwayListener onClickAway={closeOptions}>
      <Stack direction="row">
        {children && (
          <Collapse orientation="horizontal" in={!open}>
            {children}
          </Collapse>
        )}
        <Collapse orientation="horizontal" in={open}>
          <Stack direction="row" position="relative">
            <ReportButton color="error" target={`${t(`scopes.${scope}.name`)}: ${item.id}`} />
            <BugButton color="warning" target={`${t(`scopes.${scope}.name`)}: ${item.id}`} />
            {canEdit && (
              <>
                <EditButton color="secondary" />
                <DeleteButton color="error" />
              </>
            )}
          </Stack>
        </Collapse>
        <AppIconButton icon={open ? 'close' : 'more'} onClick={toggleOptions} />
      </Stack>
    </ClickAwayListener>
  );
};

export default MoreOptions;
