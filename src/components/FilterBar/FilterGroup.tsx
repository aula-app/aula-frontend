import { getGroups } from '@/services/groups';
import { GroupType } from '@/types/GroupTypes';
import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  group: number;
  setGroup: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const FilterGroup: React.FC<Props> = ({ group, setGroup, ...restOfProps }) => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Array<GroupType>>();

  const fetchGroups = async () => {
    const response = await getGroups({
      offset: 0,
      limit: 0,
    });
    if (!response.data) return;
    setGroups(response.data);
  };

  const changeRoom = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setGroup(event);
  };

  useEffect(() => {
    fetchGroups();
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
      {...restOfProps}
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
