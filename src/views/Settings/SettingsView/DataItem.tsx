import { PossibleFields } from '@/types/Scopes';
import { databaseRequest, phases } from '@/utils';
import { statusOptions } from '@/utils/commands';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Params = {
  row: PossibleFields;
  column: keyof PossibleFields;
};

const DataItem = ({ row, column }: Params) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  async function getNames(id: number) {
    await databaseRequest({
      model: 'Room',
      method: 'getRoomBaseData',
      arguments: {
        room_id: id,
      },
    }).then((response) => {
      setName(response.success ? response.data.room_name : '');
    });
  }

  switch (column) {
    case 'approved':
      return <>{t(`generics.${Boolean(row[column]) ? 'yes' : 'no'}`)}</>;
    case 'phase_id':
      return <>{t(`phases.${phases[row[column]].name}` || '')}</>;
    case 'room_id':
      getNames(Number(row[column]));
      return <>{name}</>;
    case 'status':
      return <>{t(statusOptions.find((status) => status.value === row[column])?.label || '')}</>;
    case 'userlevel':
      return <>{t(`roles.${row[column]}` || '')}</>;
    default:
      return <>{row[column]}</>;
  }
};

export default DataItem;
