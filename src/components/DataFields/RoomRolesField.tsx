import AppIcon from '@/components/AppIcon';
import { getAllRooms } from '@/services/rooms';
import { RoomType, UserType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Interface that will be exposed to the parent component.
 */

interface Props extends ButtonProps {
  user?: UserType;
  rooms: string[];
  defaultLevel: RoleTypes;
  onUpdate: (updates: { room: string; role: RoleTypes | 0 }[]) => void;
}

const RoomRolesField: React.FC<Props> = ({ user, rooms, defaultLevel, disabled = false, onUpdate, ...restOfProps }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolRooms, setRooms] = useState<RoomType[]>([]);

  const [userRoles, setUserRoles] = useState<{ room: string; role: RoleTypes }[]>(JSON.parse(user?.roles || '[]'));
  const [updateRoles, setUpdateRoles] = useState<{ room: string; role: RoleTypes | 0 }[]>([]);

  // Create role options based on room type and user level
  const getRoleOptions = (room: RoomType) => {
    const isStandardRoom = room.type === 1;
    const isAdmin = (user?.userlevel ?? 0) >= 50;

    const options = [
      { value: 0, label: isStandardRoom ? t('roles.empty') : t('roles.empty') },
      ...roles
        .filter((role) => {
          // Filter based on room type and admin status
          if (isAdmin && isStandardRoom) {
            return role < 60; // Admins can see all roles except super admin for standard rooms
          }
          return role < 40; // Non-admins see only basic roles
        })
        .map((r) => ({ value: r, label: t(`roles.${r}`) })),
    ];

    return options;
  };

  const handleRoleChange = (roomId: string, event: SelectChangeEvent<unknown>) => {
    const role = Number(event.target.value) as RoleTypes | 0;
    handleUpdate(roomId, role);
  };

  const fetchRooms = async () => {
    setLoading(true);
    const response = await getAllRooms();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.data) return;
    setRooms(response.data);
  };

  const handleUpdate = async (room: string, role: RoleTypes | 0) => {
    // delete existing role if it is the same as the new role
    const existingRole = userRoles.find((r) => r.room === room)?.role;
    if (existingRole === role) {
      setUpdateRoles(updateRoles.filter((r) => r.room !== room));
      return;
    }

    // update existing role if it exists
    const existingIndex = updateRoles.findIndex((r) => r.room === room);
    if (existingIndex > -1) {
      const updatedRoles = [...updateRoles];
      updatedRoles[existingIndex].role = role;
      setUpdateRoles(updatedRoles);
      return;
    }

    // add new role
    setUpdateRoles([{ room, role }, ...updateRoles]);
  };

  const onSubmit = async () => {
    onUpdate(updateRoles);
    setOpen(false);
  };

  const handleClose = () => {
    setUserRoles(JSON.parse(user?.roles || '[]'));
    setOpen(false);
  };

  useEffect(() => {
    fetchRooms();
    setUserRoles(JSON.parse(user?.roles || '[]'));
  }, [user]);

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label={t('actions.set', { var: t('roles.roomRoles') })}
        data-testid="room-roles-dialog-open-button"
        {...restOfProps}
      >
        <AppIcon icon="key" pr={2} aria-hidden="true" />
        {t('actions.set', {
          var: t('roles.roomRoles'),
        })}
      </Button>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        fullWidth
        maxWidth="sm"
        aria-labelledby="room-roles-dialog-title"
        aria-describedby="room-roles-dialog-description"
        aria-modal="true"
        data-testid="room-roles-dialog"
      >
        <DialogTitle id="room-roles-dialog-title">
          {t('actions.set', {
            var: t('roles.roomRoles'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        <List
          sx={{ maxHeight: 300, overflow: 'auto', display: 'flex', flexDirection: 'column' }}
          role="group"
          aria-label={t('ui.accessibility.roomRolesList')}
          id="room-roles-dialog-description"
        >
          {schoolRooms.map((room, index) => {
            const currentRole =
              updateRoles.find((role) => role.room === room.hash_id)?.role ??
              userRoles.find((role) => role.room === room.hash_id)?.role ??
              (room.type === 1 ? defaultLevel : 0);

            const roleOptions = getRoleOptions(room);
            const isAdminLocked = (user?.userlevel ?? 0) >= 50 && room.type === 1;

            return (
              <ListItemButton
                key={room.hash_id}
                sx={{ py: 0, order: room.type === 1 ? 0 : 1 }}
                tabIndex={index === 0 ? 0 : -1}
                role="listitem"
                aria-label={room.room_name || 'Aula'}
                id={`room-role-item-${room.hash_id}`}
                data-testid="room-role-list"
              >
                <ListItem
                  key={room.hash_id}
                  data-testid="room-role-list-item"
                  secondaryAction={
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={currentRole}
                        onChange={(event) => handleRoleChange(room.hash_id, event)}
                        disabled={disabled || isAdminLocked}
                        aria-labelledby={`room-name-${room.hash_id}`}
                        data-testid={`room-role-select-${room.hash_id}`}
                      >
                        {roleOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            data-testid={`room-role-option-${option.value}`}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  }
                >
                  <ListItemText
                    primary={room.room_name || 'Aula'}
                    sx={{ maxWidth: '18rem' }} // TODO: still not good enough for mobile view
                    slotProps={{
                      primary: {
                        id: `room-name-${room.hash_id}`,
                        sx: { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      },
                    }}
                  />
                </ListItem>
              </ListItemButton>
            );
          })}
        </List>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            color="secondary"
            autoFocus
            tabIndex={0}
            aria-label={t('actions.cancel')}
            data-testid="room-roles-dialog-cancel-button"
          >
            {t('actions.cancel')}
          </Button>
          <Button onClick={onSubmit} variant="contained" tabIndex={0} aria-label={t('actions.confirm')}>
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomRolesField;
