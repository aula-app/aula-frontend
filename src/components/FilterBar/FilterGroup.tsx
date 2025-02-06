import { GroupType } from '@/types/GroupTypes';
import { databaseRequest } from '@/utils';
import { MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  group: number;
  setGroup: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const FilterGroup = ({ group, setGroup }: Params) => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Array<GroupType>>();

  const getGroups = async () => {
    await databaseRequest({
      model: 'Group',
      method: 'getGroups',
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response) => {
      if (!response.data) return;
      setGroups(response.data);
    });
  };

  const changeRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setGroup(event);
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <TextField
      select
      label={t('scopes.group.name')}
      value={group}
      onChange={changeRoom}
      variant="filled"
      size="small"
      sx={{ minWidth: 282 }}
      disabled={!groups}
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {groups &&
        groups.map((group) => (
          <MenuItem value={group.id} key={group.group_name}>
            {group.group_name}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default FilterGroup;
