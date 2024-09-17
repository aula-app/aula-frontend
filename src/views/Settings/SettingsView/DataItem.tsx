import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { databaseRequest, messageConsentValues, phases } from '@/utils';
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
      setName(
        scope === 'users'
          ? response.data.realname
          : scope === 'rooms'
            ? response.data.room_name
            : response.data.group_name
      );
    });
  }

  switch (column) {
    case 'approved':
      return <>{t(`generics.${Boolean(row[column]) ? 'yes' : 'no'}`)}</>;
    case 'creator_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'phase_id':
      return <>{t(`phases.${phases[row[column]].name}` || '')}</>;
    case 'room_id':
      getNames('rooms', Number(row[column]));
      return <>{name}</>;
    case 'status':
      return <>{t(statusOptions.find((status) => status.value === row[column])?.label || '')}</>;
    case 'target_group':
      getNames('groups', Number(row[column]));
      return <>{name}</>;
    case 'target_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'user_id':
      getNames('users', Number(row[column]));
      return <>{name}</>;
    case 'userlevel':
      return <>{t(`roles.${row[column]}` || '')}</>;
    case 'user_needs_to_consent':
      return <>{t(`consent.${messageConsentValues[row[column]]}` || '')}</>;
    default:
      return <>{row[column]}</>;
  }
};

export default DataItem;
