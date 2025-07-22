import AppIcon from '@/components/AppIcon';
import { StatusTypes } from '@/types/Generics';
import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { announceToScreenReader, checkPermissions } from '@/utils';
import { WarningAmber } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  useTheme,
} from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FilterOptionsType {
  status: StatusTypes;
  filter: [keyof PossibleFields, string];
}

type Props = {
  extraTools?: ({ items }: { items: Array<string> }) => JSX.Element;
  scope: SettingNamesType;
  selected: Array<string>;
  setEdit: (value: boolean) => void;
  setDelete: (ideas: Array<string>) => void;
};

const ToolBar: React.FC<Props> = ({ extraTools, scope, selected, setEdit, setDelete }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isOpen, setOpen] = useState(false);

  // References to buttons for focus management
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmDeleteButtonRef = useRef<HTMLButtonElement>(null);

  const onDelete = () => {
    setDelete(selected);
    setOpen(false);

    // Announce the deletion action to screen readers
    announceToScreenReader(
      t('ui.accessibility.itemsDeleted', {
        count: selected.length,
        type: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`),
      }),
      'assertive'
    );

    // Return focus to the delete button
    setTimeout(() => {
      if (deleteButtonRef.current) {
        deleteButtonRef.current.focus();
      }
    }, 100);
  };

  const handleOpenDialog = () => {
    setOpen(true);

    // Announce dialog opening to screen readers
    announceToScreenReader(
      t('ui.accessibility.confirmDeletion', {
        count: selected.length,
        type: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`),
      }),
      'assertive'
    );
  };

  const handleCloseDialog = () => {
    setOpen(false);

    // Return focus to the delete button
    setTimeout(() => {
      if (deleteButtonRef.current) {
        deleteButtonRef.current.focus();
      }
    }, 100);
  };

  const handleEdit = () => {
    setEdit(true);

    // Announce editing mode to screen readers
    announceToScreenReader(
      t('ui.accessibility.editingStarted', {
        type: t(`scopes.${scope}.name`),
      }),
      'polite'
    );
  };

  // Handle keyboard navigation within the toolbar
  const handleToolbarKeyDown = (e: React.KeyboardEvent) => {
    // When Delete button is focused and Enter or Space is pressed, open confirmation dialog
    if (document.activeElement === deleteButtonRef.current && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleOpenDialog();
    }

    // When Add button is focused and Enter or Space is pressed, enter edit mode
    if (document.activeElement === addButtonRef.current && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleEdit();
    }
  };

  // Focus first button in dialog when it opens
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Stack
      direction="row"
      mt={1}
      p={2}
      role="toolbar"
      aria-label={t('ui.accessibility.actionToolbar')}
      onKeyDown={handleToolbarKeyDown}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRight: 0,
        borderLeft: 0,
      }}
    >
      <Stack direction="row" gap={1} alignItems="center" width="100%" flexWrap="wrap">
        {scope !== 'ideas' && (
          <Button
            variant="outlined"
            onClick={handleEdit}
            ref={addButtonRef}
            data-testid={`add-${scope}-button`}
            aria-label={t('actions.add', { var: t(`scopes.${scope}.name`) })}
          >
            <AppIcon icon="add" pr={2} />
            {t('actions.add', { var: t(`scopes.${scope}.name`) })}
          </Button>
        )}
        {extraTools && extraTools({ items: selected })}
        {checkPermissions(scope, 'delete') && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenDialog}
            disabled={selected.length === 0}
            ref={deleteButtonRef}
            data-testid={`remove-${scope}-button`}
            aria-label={t('actions.remove', {
              var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`),
            })}
            aria-disabled={selected.length === 0}
          >
            <AppIcon icon="delete" pr={2} />
            {t('actions.remove', {
              var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`),
            })}
          </Button>
        )}
      </Stack>
      <Dialog
        open={isOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        aria-modal="true"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row" alignItems="center">
            <WarningAmber sx={{ mr: 1 }} color="error" aria-hidden="true" />{' '}
            {t('deletion.headline', { var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`) })}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {t('deletion.confirm', { var: t(`scopes.${scope}.${selected.length === 1 ? 'name' : 'plural'}`) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" ref={cancelButtonRef} aria-label={t('actions.cancel')}>
            {t('actions.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={onDelete}
            ref={confirmDeleteButtonRef}
            data-testid={`confirm-delete-${scope}-button`}
            aria-label={t('actions.delete')}
          >
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ToolBar;
