import { FieldHint, FieldLabel, fieldBoxClasses, listBoxClasses, popoverClasses } from '@/v2/components/input/Field';
import Icon from '@/v2/components/ui/Icon';
import { Button, Key, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  id?: string;
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  dense?: boolean;
  className?: string;
  'data-testid'?: string;
}

const SelectInput = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  dense = false,
  className,
  'data-testid': dataTestId,
}: SelectInputProps) => {
  const hasValue = options.some((option) => option.value === value);

  return (
    <Select
      id={id}
      selectedKey={hasValue ? value : null}
      onSelectionChange={(key: Key | null) => key !== null && onChange?.(String(key))}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={!!error}
      validationBehavior="aria"
      className={twMerge('flex flex-col w-fit', className)}
    >
      {({ isOpen }) => (
        <>
          <div className="relative w-full">
            <Button
              data-testid={dataTestId}
              className={twMerge(fieldBoxClasses({ dense, invalid: !!error }), 'flex items-center text-left')}
            >
              <SelectValue className="text-nowrap pr-6">
                {({ isPlaceholder, selectedText }) =>
                  isPlaceholder ? <span className="invisible select-none">{' '}</span> : selectedText
                }
              </SelectValue>
            </Button>

            {/* Zero-height sizer: reserves the widest option's width so the trigger never renders
                narrower than its own dropdown. Mirrors the button's text metrics and padding. */}
            <div aria-hidden="true" className="h-0 overflow-hidden invisible">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={twMerge('text-sm font-medium text-nowrap pr-6', dense ? 'px-3' : 'px-4')}
                >
                  {option.label}
                </div>
              ))}
            </div>

            <FieldLabel required={required} invalid={!!error} floated={hasValue || isOpen}>
              {label}
            </FieldLabel>

            <span
              aria-hidden="true"
              className={twMerge(
                'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            >
              <Icon type="chevronDown" size="0.75em" className="text-muted mt-0.5" />
            </span>
          </div>

          <FieldHint error={error} helperText={helperText} />

          <Popover offset={4} maxHeight={240} className={twMerge('min-w-(--trigger-width) flex', popoverClasses)}>
            <ListBox
              items={options}
              data-testid={dataTestId ? `${dataTestId}-list` : undefined}
              className={twMerge(listBoxClasses, 'flex-1')}
            >
              {(option) => (
                <ListBoxItem
                  id={option.value}
                  textValue={option.label}
                  data-testid={dataTestId ? `${dataTestId}-option-${option.value}` : undefined}
                  className={twMerge(
                    'px-3 py-2 text-sm cursor-pointer outline-none transition-colors duration-100 text-nowrap text-muted',
                    'data-selected:text-current data-selected:font-medium data-focused:bg-primary/10'
                  )}
                >
                  {option.label}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </>
      )}
    </Select>
  );
};

SelectInput.displayName = 'SelectInput';

export default SelectInput;
