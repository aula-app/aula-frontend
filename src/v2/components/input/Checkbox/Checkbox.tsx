import Icon from '@/v2/components/ui/Icon';
import { ReactNode, forwardRef, useId } from 'react';
import { CheckboxProps as AriaCheckboxProps, Checkbox as AriaCheckbox } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps extends Omit<
  AriaCheckboxProps,
  'children' | 'className' | 'style' | 'isSelected' | 'isDisabled' | 'isRequired' | 'isInvalid' | 'validationBehavior'
> {
  label: string;
  checked?: boolean;
  error?: string;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ id, label, checked, error, helperText, disabled = false, required = false, className, ...props }, ref) => {
    const { t } = useTranslation();
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintText = error ?? helperText ?? (required ? t('v2.form.validation.required') : undefined);
    const hintId = hintText ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <AriaCheckbox
          {...props}
          ref={ref}
          id={inputId}
          isSelected={checked}
          isDisabled={disabled}
          isRequired={required}
          isInvalid={!!error}
          validationBehavior="aria"
          aria-describedby={hintId}
          className={twMerge(
            'group flex items-center gap-2 text-sm select-none cursor-pointer',
            'data-disabled:cursor-not-allowed data-disabled:text-muted',
            className
          )}
        >
          <span
            aria-hidden="true"
            className={twMerge(
              'flex size-4 shrink-0 items-center justify-center rounded border border-secondary',
              'transition-colors duration-150',
              'group-data-selected:border-primary group-data-selected:bg-primary',
              'group-data-invalid:border-error-fg',
              'group-data-disabled:border-transparent group-data-disabled:bg-neutral',
              'group-data-disabled:group-data-selected:border-transparent group-data-disabled:group-data-selected:bg-neutral',
              'group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-current'
            )}
          >
            <Icon
              type="check"
              className="size-3 text-primary-fg opacity-0 transition-opacity duration-150 group-data-selected:opacity-100 group-data-disabled:text-foreground"
            />
          </span>
          <span className={required ? 'font-bold after:content-["*"] after:ml-0.5' : undefined}>{label}</span>
        </AriaCheckbox>
        {hintText && (
          <span id={hintId} className={twMerge('px-1 text-xs', error ? 'text-error-fg' : 'text-muted')}>
            {error && <Icon type="alert" className="inline-block mr-1 mb-0.5" />}
            {hintText}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
