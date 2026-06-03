import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, error, disabled = false, required = false, className, ...props }, ref) => {
    const { t } = useTranslation();
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

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
            aria-disabled={disabled || undefined}
            aria-describedby={errorId}
            aria-invalid={!!error || undefined}
            className={twMerge(
              'h-4 w-4 rounded border border-secondary accent-primary cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              disabled ? 'cursor-not-allowed opacity-50' : '',
              className
            )}
            {...props}
          />
          <label htmlFor={inputId} className={twMerge('text-sm select-none', disabled ? 'opacity-50' : '')}>
            {label}
            {required && (
              <>
                <span aria-hidden="true" className="ml-0.5 text-error-text">
                  *
                </span>
                <span className="sr-only">{t('v2.form.validation.required')}</span>
              </>
            )}
          </label>
        </div>
        {error && (
          <span id={errorId} className="text-xs text-error-text px-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
