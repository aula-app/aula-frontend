import Icon from '@/components/new/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { InputHTMLAttributes, ReactNode, forwardRef, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string | ReactNode;
  endAdornment?: ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { id, label, error, helperText, disabled = false, required = false, className, type, endAdornment, ...props },
    ref
  ) => {
    const { t } = useTranslation();
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = !error && helperText ? `${inputId}-helper` : undefined;

    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const trailingContent = isPassword ? (
      <IconButton
        type="button"
        aria-label={showPassword ? t('v2.form.password.hide') : t('v2.form.password.show')}
        aria-pressed={showPassword}
        className="text-muted"
        onClick={() => setShowPassword((v) => !v)}
      >
        <Icon type={showPassword ? 'eyeOff' : 'eye'} size="1.25em" />
      </IconButton>
    ) : (
      (endAdornment ?? null)
    );

    return (
      <div className="flex flex-col w-full mb-3">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            placeholder=" "
            className={twMerge(
              'peer block w-full rounded-lg border border-secondary bg-transparent px-3 pt-4 pb-2 shadow-inner',
              'text-sm text-foreground transition-all duration-200',
              'focus:outline-1 focus:outline-offset-1',
              'hover:border-input-border-hover outline-current',
              trailingContent ? 'pr-10' : '',
              error && 'border-error focus:outline-error focus:border-error',
              disabled ? 'cursor-not-allowed opacity-50' : '',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={twMerge(
                'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 origin-left text-sm transition-all duration-200',
                'bg-background px-0.5',
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
                'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75',
                'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75',
                error ? 'text-error-fg peer-focus:text-error-fg' : 'text-muted peer-focus:text-current'
              )}
            >
              {label}
              {required && (
                <>
                  <span aria-hidden="true" className="ml-0.5">
                    *
                  </span>
                  <span className="sr-only">{t('v2.form.validation.required')}</span>
                </>
              )}
            </label>
          )}
          {trailingContent && <div className="absolute right-1 top-1/2 -translate-y-1/2">{trailingContent}</div>}
        </div>
        <div
          className={`grid transition-all duration-200 ease-in-out ${
            error || helperText ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div>
            {error ? (
              <span id={errorId} className="block pt-1 px-1 text-xs text-error-fg">
                <Icon type="alert" className="inline-block mr-1 mb-0.5" />
                {error}
              </span>
            ) : (
              <span id={helperId} className="block pt-1 px-1 text-xs text-muted">
                {helperText}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
