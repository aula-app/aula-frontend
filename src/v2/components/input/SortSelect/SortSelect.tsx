import IconButton from '@/v2/components/button/IconButton';
import SelectInput, { SelectOption } from '@/v2/components/input/SelectInput';
import Icon from '@/v2/components/ui/Icon';
import { useTranslation } from 'react-i18next';

export type SortOption = SelectOption;

interface Props {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  reversed: boolean;
  onReversedChange: (reversed: boolean) => void;
  /** Defaults to the generic "sort by" label. */
  label?: string;
  className?: string;
  /** Applied to the select; the direction button gets `${testId}-direction`. */
  'data-testid'?: string;
}

const SortSelect = ({
  options,
  value,
  onChange,
  reversed,
  onReversedChange,
  label,
  className = '',
  'data-testid': testId,
}: Props) => {
  const { t } = useTranslation();
  const direction = t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`);

  return (
    <SelectInput
      dense
      label={label ?? t('v2.ui.sort.label')}
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
          onClick={() => onReversedChange(!reversed)}
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
