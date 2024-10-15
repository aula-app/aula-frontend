import { AppIcon } from '@/components';
import { DeleteData } from '@/components/Data';
import EditData from '@/components/Data/EditData';
import { GroupType } from '@/types/GroupTypes';
import { databaseRequest } from '@/utils';
import { Box, Chip, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GroupView = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedId, setId] = useState<number | undefined>();
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

  const setDelete = (id: number) => {
    setId(id);
    setDeleteGroup(true);
  };

  const setEdit = (id?: number) => {
    setId(id || undefined);
    setEditGroup(true);
  };

  const onClose = () => {
    setId(undefined);
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
          label={t('generics.add', { var: t('views.group') })}
          avatar={<AppIcon icon="add" />}
          onClick={() => setEdit()}
        />
        {groups.map((group, key) => {
          return (
            <Chip
              key={key}
              label={group.group_name}
              onClick={() => setEdit(group.id)}
              onDelete={() => setDelete(group.id)}
            />
          );
        })}
      </Stack>
      <EditData scope="groups" id={selectedId} isOpen={!!editGroup} onClose={onClose} />
      <DeleteData scope="groups" id={selectedId || 0} isOpen={!!deleteGroup} onClose={onClose} />
    </Stack>
  );
};

export default GroupView;
