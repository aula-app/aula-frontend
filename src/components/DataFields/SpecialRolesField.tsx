import AppIcon from '@/components/AppIcon';
import { getRooms, getRoomsByUser } from '@/services/rooms';
import { addSpecialRoles } from '@/services/users';
import { RoomType, UserType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectRole from '../SelectRole';

/**
 * Interface that will be exposed to the parent component.
 */

interface Props extends ButtonProps {
  user: UserType;
  onClose: () => void;
}

const SpecialRolesField: React.FC<Props> = ({ user, disabled = false, onClose, ...restOfProps }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [userRoles, setUserRoles] = useState<{ room: string; role: RoleTypes }[]>(JSON.parse(user.roles || '[]'));
  const [updateRoles, setUpdateRoles] = useState<{ room: string; role: RoleTypes }[]>([]);

  const fetchRooms = async () => {
    setLoading(true);
    const response = await getRoomsByUser(user.hash_id);
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.data) return;
    setRooms(response.data);
  };

  const handleUpdate = async (room: string, role?: RoleTypes | 0) => {
    if (!role) return;

    // delete existing role if it is the same as the new role
    const existingRole = userRoles.find((r) => r.room === room)?.role || user.userlevel;
    if (existingRole === role) {
      setUpdateRoles(updateRoles.filter((r) => r.room !== room));
      return;
    }

    // update existing role if it exists
    const existingIndex = updateRoles.findIndex((r) => r.room === room);
    if (existingIndex !== -1) {
      const updatedRoles = [...updateRoles];
      updatedRoles[existingIndex].role = role;
      setUpdateRoles(updatedRoles);
      return;
    }

    // add new role
    setUpdateRoles([{ room, role }, ...updateRoles]);
  };

  const onSubmit = async () => {
    setLoading(true);
    const responses = await Promise.all(updateRoles.map((role) => addSpecialRoles(user.hash_id, role.role, role.room)));

    const errorResponse = responses.find((response) => response.error);
    if (errorResponse) {
      setError(errorResponse.error);
    } else {
      setOpen(false);
    }

    setLoading(false);
    onClose();
  };

  const handleClose = () => {
    setUpdateRoles([]);
    setOpen(false);
  };

  useEffect(() => {
    fetchRooms();
    setUserRoles(JSON.parse(user.roles || '[]'));
  }, [user]);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} disabled={disabled} {...restOfProps}>
        <AppIcon icon="key" pr={2} />
        {t('actions.set', {
          var: t('roles.roomRoles'),
        })}
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('actions.set', {
            var: t('roles.roomRoles'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {rooms.map((room) => {
            const currentRole =
              updateRoles.find((role) => role.room === room.hash_id)?.role ||
              userRoles.find((role) => role.room === room.hash_id)?.role ||
              user.userlevel;
            return (
              <ListItemButton key={room.hash_id} sx={{ py: 0 }}>
                <ListItem
                  secondaryAction={
                    <SelectRole
                      userRole={currentRole}
                      setRole={(role) => handleUpdate(room.hash_id, role)}
                      size="small"
                      noAdmin
                    />
                  }
                >
                  <ListItemText primary={room.room_name || 'Aula'} />
                </ListItem>
              </ListItemButton>
            );
          })}
        </List>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={onSubmit} variant="contained">
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpecialRolesField;
