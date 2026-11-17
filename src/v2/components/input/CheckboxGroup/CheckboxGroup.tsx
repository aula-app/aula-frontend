import Checkbox from '@/v2/components/input/Checkbox';
import { SelectOption } from '@/v2/components/input/SelectInput';
import { CheckboxGroup as AriaCheckboxGroup, Label } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface CheckboxGroupProps {
  label?: string;
  options: SelectOption[];
  /** Values of the checked options. */
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  'data-testid'?: string;
}

/** A labelled set of checkboxes for picking any number of a few fixed options. */
const CheckboxGroup = ({
  label,
  options,
  value,
  onChange,
  className,
  'data-testid': dataTestId,
}: CheckboxGroupProps) => (
  <AriaCheckboxGroup
    value={value}
    onChange={onChange}
    data-testid={dataTestId}
    className={twMerge('flex flex-col gap-1 mb-1', className)}
  >
    {label && <Label className="text-xs text-muted">{label}</Label>}
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {options.map((option) => (
        <Checkbox
          key={option.value}
          value={option.value}
          label={option.label}
          data-testid={dataTestId ? `${dataTestId}-${option.value}` : undefined}
        />
      ))}
    </div>
  </AriaCheckboxGroup>
);

export default CheckboxGroup;
