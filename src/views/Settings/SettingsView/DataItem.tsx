import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, phases } from '@/utils';
import { statusOptions } from '@/utils/commands';
import DataConfig from '@/utils/Data';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  row: PossibleFields;
  column: keyof PossibleFields;
};

const DataItem = ({ row, column }: Params) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  async function getNames(scope: SettingNamesType, id: number) {
    await databaseRequest({
      model: DataConfig[scope].requests.model,
      method: DataConfig[scope].requests.get,
      arguments: {
        [DataConfig[scope].requests.id]: id,
      },
    }).then((response) => {
      if (!response.success) return;
      setName(column === 'user_id' ? response.data.realname : response.data.room_name);
    });
  }

  switch (column) {
    case 'approved':
      return <>{t(`generics.${Boolean(row[column]) ? 'yes' : 'no'}`)}</>;
    case 'phase_id':
      return <>{t(`phases.${phases[row[column]].name}` || '')}</>;
    case 'room_id':
      getNames('rooms', Number(row[column]));
      return <>{name}</>;
    case 'status':
      return <>{t(statusOptions.find((status) => status.value === row[column])?.label || '')}</>;
    case 'user_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'userlevel':
      return <>{t(`roles.${row[column]}` || '')}</>;
    default:
      return <>{row[column]}</>;
  }
};

export default DataItem;
