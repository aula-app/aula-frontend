import { AppIcon } from '@/components';
import { DeleteData } from '@/components/Data';
import EditData from '@/components/Data/EditData';
import { GroupType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Chip, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GroupView = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedItem, setItem] = useState<GroupType>();
  const [editGroup, setEditGroup] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(false);

  const categoriesFetch = async () =>
    await databaseRequest({
      model: 'Group',
      method: 'getGroups',
      arguments: {},
    }).then((response) => {
      if (response.success) setGroups(response.data ? response.data : []);
    });

  const setDelete = (item: GroupType) => {
    setItem(item);
    setDeleteGroup(true);
  };

  const setEdit = (item?: GroupType) => {
    setItem(item || undefined);
    setEditGroup(true);
  };

  const onClose = () => {
    setItem(undefined);
    setEditGroup(false);
    setDeleteGroup(false);
    categoriesFetch();
  };

  useEffect(() => {
    categoriesFetch();
  }, []);

  return (
    <Stack pb={3}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip
          label={t('actions.add', { var: t('scopes.group.name') })}
          avatar={<AppIcon icon="add" />}
          onClick={() => setEdit()}
        />
        {groups.map((group, key) => {
          return (
            <Chip key={key} label={group.group_name} onClick={() => setEdit(group)} onDelete={() => setDelete(group)} />
          );
        })}
      </Stack>
      <EditData scope="groups" item={selectedItem} isOpen={!!editGroup} onClose={onClose} />
      <DeleteData scope="groups" id={Number(selectedItem?.id)} isOpen={!!deleteGroup} onClose={onClose} />
    </Stack>
  );
};

export default GroupView;
