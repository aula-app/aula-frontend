import { ScopeType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { ClickAwayListener, Collapse, IconButtonOwnProps, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import ReportButton from '../Buttons/ReportButton';
import { checkPermissions } from '@/utils';
import { useParams } from 'react-router-dom';

interface Props extends IconButtonOwnProps {
  item: ScopeType;
  scope: SettingNamesType;
  onDelete: () => void;
  onEdit: () => void;
  children?: React.ReactNode;
  link?: string;
}

/**
 * Renders question mark badge that triggers a tooltip on hover
 * @component MoreOptions
 */
const MoreOptions: React.FC<Props> = ({ item, scope, children, onDelete, onEdit, color, link, ...restOfProps }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { phase } = useParams();

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const closeOptions = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    if (open) setOpen(false);
  };

  const targetName =
    'title' in item ? item.title : 'name' in item ? item.name : 'content' in item ? item.content : item.id;

  return (
    <ClickAwayListener onClickAway={closeOptions}>
      <Stack direction="row">
        {children && (
          <Collapse orientation="horizontal" in={!open}>
            {children}
          </Collapse>
        )}
        <Collapse 
          orientation="horizontal" 
          in={open}
          role="menu"
          aria-label={t('actions.options')}
        >
          <Stack 
            direction="row" 
            position="relative"
            role="menubar"
            aria-orientation="horizontal"
          >
            <ReportButton 
              color={color || 'error'} 
              target={`${t(`scopes.${scope}.name`)}: ${targetName}`} 
              link={link}
              role="menuitem" 
            />
            {phase && (
              <>
                {checkPermissions(scope, 'edit', 'user_hash_id' in item ? item.user_hash_id : undefined) && (
                  <EditButton 
                    color={color || 'secondary'} 
                    onEdit={onEdit}
                    role="menuitem"
                  />
                )}
                {checkPermissions(scope, 'delete', 'user_hash_id' in item ? item.user_hash_id : undefined) && (
                  <DeleteButton 
                    color={color || 'error'} 
                    scope={scope} 
                    onDelete={onDelete}
                    role="menuitem"
                  />
                )}
              </>
            )}
          </Stack>
        </Collapse>
        <AppIconButton 
          icon={open ? 'close' : 'more'} 
          onClick={toggleOptions}
          aria-expanded={open}
          aria-label={open ? t('actions.close') : t('actions.more')}
          {...restOfProps} 
        />
      </Stack>
    </ClickAwayListener>
  );
};

export default MoreOptions;
