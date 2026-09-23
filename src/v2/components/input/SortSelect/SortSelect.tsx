import Icon from '@/components/new/Icon/Icon';
import IconButton from '@/v2/components/button/IconButton';
import SelectInput, { SelectOption } from '@/v2/components/input/SelectInput';
import { useTranslation } from 'react-i18next';

export type SortOption = SelectOption;

interface Props {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  reversed: boolean;
  onReverse: () => void;
  className?: string;
  'data-testid'?: string;
}

const SortSelect = ({
  options,
  value,
  onChange,
  reversed,
  onReverse,
  className = '',
  'data-testid': testId,
}: Props) => {
  const { t } = useTranslation();
  const direction = t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`);

  return (
    <SelectInput
      dense
      label={t('v2.ui.sort.label')}
      options={options}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={testId}
      endAdornment={
        <IconButton
          aria-label={direction}
          hint={direction}
          aria-pressed={reversed}
          onClick={onReverse}
          className="h-full rounded-none rounded-r-lg"
          data-testid={testId ? `${testId}-direction` : undefined}
        >
          <Icon type={reversed ? 'sortDesc' : 'sortAsc'} size="1.1em" />
        </IconButton>
      }
    />
  );
};

export default SortSelect;
