import { PossibleFields } from '@/types/Scopes';
import { phases } from '@/utils';
import { statusOptions } from '@/utils/commands';
import { useTranslation } from 'react-i18next';

type Params = {
  row: PossibleFields;
  column: keyof PossibleFields;
};

const DataItem = ({ row, column }: Params) => {
  const { t } = useTranslation();

  switch (column) {
    case 'phase_id':
      return <>{t(`phases.${phases[row[column]].name}` || '')}</>;
    case 'status':
      return <>{t(statusOptions.find((status) => status.value === row[column])?.label || '')}</>;
    case 'userlevel':
      return <>{t(`roles.${row[column]}` || '')}</>;
    default:
      return <>{row[column]}</>;
  }
};

export default DataItem;
