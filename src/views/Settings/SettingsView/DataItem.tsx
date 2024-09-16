import { PossibleFields } from '@/types/Scopes';
import { statusOptions } from '@/utils/commands';
import { useTranslation } from 'react-i18next';

type Params = {
  row: PossibleFields;
  column: keyof PossibleFields;
};

const DataItem = ({ row, column }: Params) => {
  const { t } = useTranslation();

  switch (column) {
    case 'status':
      return <>{t(statusOptions.find((status) => status.value === row[column])?.label || '')}</>;
    default:
      return <>{row[column]}</>;
  }
};

export default DataItem;
