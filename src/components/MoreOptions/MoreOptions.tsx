import { ScopeType } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { withKeyboardSupport } from '@/utils/accessibility';
import { checkPermissions } from '@/utils';
import { ClickAwayListener, Collapse, IconButtonOwnProps, Stack } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIconButton from '../AppIconButton';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import ReportButton from '../Buttons/ReportButton';
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
  const optionsRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  const toggleOptions = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setOpen(!open);
    
    // When opening, focus the first button
    if (!open) {
      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 100);
    }
  };

  const closeOptions = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    if (open) setOpen(false);
  };

  // Handle keyboard navigation within the options menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (open) {
      if (e.key === 'Escape') {
        setOpen(false);
        e.preventDefault();
      } else if (e.key === 'Tab' && e.shiftKey && document.activeElement === firstButtonRef.current) {
        // Trap focus within the menu when tabbing backwards from the first element
        e.preventDefault();
        const buttons = optionsRef.current?.querySelectorAll('button');
        if (buttons && buttons.length > 0) {
          (buttons[buttons.length - 1] as HTMLButtonElement).focus();
        }
      }
    } else {
      // If menu is closed, handle Enter/Space to open it
      if (e.key === 'Enter' || e.key === ' ') {
        toggleOptions(e);
      }
    }
  };

  const targetName =
    'title' in item ? item.title : 'name' in item ? item.name : 'content' in item ? item.content : item.id;

  return (
    <ClickAwayListener onClickAway={closeOptions}>
      <Stack direction="row" onKeyDown={handleKeyDown}>
        {children && (
          <Collapse orientation="horizontal" in={!open}>
            {children}
          </Collapse>
        )}
        <Collapse orientation="horizontal" in={open}>
          <Stack 
            direction="row" 
            position="relative" 
            ref={optionsRef}
            role="menu"
            aria-label={t('actions.options_menu')}
          >
            <ReportButton 
              color={color || 'error'} 
              target={`${t(`scopes.${scope}.name`)}: ${targetName}`} 
              link={link}
              ref={firstButtonRef}
              aria-label={t('actions.report')}
              role="menuitem"
            />
            {phase && (
              <>
                {checkPermissions(scope, 'edit', 'user_hash_id' in item ? item.user_hash_id : undefined) && (
                  <EditButton 
                    color={color || 'secondary'} 
                    onEdit={onEdit}
                    aria-label={t('actions.edit')}
                    role="menuitem"
                  />
                )}
                {checkPermissions(scope, 'delete', 'user_hash_id' in item ? item.user_hash_id : undefined) && (
                  <DeleteButton 
                    color={color || 'error'} 
                    scope={scope} 
                    onDelete={onDelete}
                    aria-label={t('actions.delete')}
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
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={open ? t('actions.close_menu') : t('actions.open_menu')}
          {...restOfProps} 
        />
      </Stack>
    </ClickAwayListener>
  );
};

export default MoreOptions;
