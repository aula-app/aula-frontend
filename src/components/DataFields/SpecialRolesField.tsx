import AppIcon from '@/components/AppIcon';
import { getRooms } from '@/services/rooms';
import { RoomType, UserType } from '@/types/Scopes';
import { RoleTypes, UpdtesObject } from '@/types/SettingsTypes';
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
}

const SpecialRolesField: React.FC<Props> = ({ user, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [updateRoles, setUpdateRoles] = useState<{ room: string; role: RoleTypes }[]>([]);

  const fetchRooms = async () => {
    setLoading(true);
    const response = await getRooms();
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.data) return;
    setRooms(response.data);
  };

  const handleUpdate = async (room: string, role?: RoleTypes | 0) => {
    if (!role) return;

    // delete existing role if it is the same as the new role
    const existingRole = user.roles?.find((r) => r.room === room)?.role || user.userlevel;
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

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} disabled={disabled} {...restOfProps}>
        <AppIcon icon="key" pr={2} />
        {t('actions.set', {
          var: t('roles.roomRoles'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
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
              user.roles?.find((role) => role.room === room.hash_id)?.role ||
              user.userlevel;
            return (
              <ListItemButton key={room.hash_id} sx={{ py: 0 }}>
                <ListItem
                  secondaryAction={
                    <SelectRole
                      userRole={currentRole}
                      setRole={(role) => handleUpdate(room.hash_id, role)}
                      size="small"
                    />
                  }
                >
                  <ListItemText primary={room.room_name} />
                </ListItem>
              </ListItemButton>
            );
          })}
        </List>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={onClose} color="secondary" autoFocus>
            {t('actions.cancel')}
          </Button>
          <Button onClick={() => {}} variant="contained">
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpecialRolesField;
