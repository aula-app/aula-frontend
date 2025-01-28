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
                <EditButton color="secondary" onEdit={onEdit} />
                <DeleteButton color="error" scope={scope} onDelete={onDelete} />
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
