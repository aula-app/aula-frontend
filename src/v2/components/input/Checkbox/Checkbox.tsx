import Icon from '@/v2/components/ui/Icon';
import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string | ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, error, helperText, disabled = false, required = false, className, ...props }, ref) => {
    const { t } = useTranslation();
    const inputId = id || useId();
    const hintText = error ?? helperText ?? (required ? t('v2.form.validation.required') : undefined);
    const hintId = hintText ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            aria-describedby={hintId}
            aria-invalid={!!error || undefined}
            className={twMerge(
              'h-4 w-4 rounded border border-secondary accent-primary cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              disabled ? 'cursor-not-allowed opacity-50' : '',
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={twMerge(
              'text-sm select-none',
              disabled ? 'opacity-50' : '',
              required ? 'after:content-["*"] after:ml-0.5 font-bold' : ''
            )}
          >
            {label}
          </label>
        </div>
        {hintText && (
          <span
            id={hintId}
            role={error ? 'alert' : undefined}
            className={twMerge('px-1 text-xs', error ? 'text-error-text' : 'text-secondary')}
          >
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
