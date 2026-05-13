import Icon from '@/components/new/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { InputHTMLAttributes, ReactNode, forwardRef, useId, useState } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  endAdornment?: ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { id, label, error, helperText, disabled = false, required = false, className, type, endAdornment, ...props },
    ref
  ) => {
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
        tabIndex={-1}
        title={showPassword ? 'Hide password' : 'Show password'}
        className="text-text-secondary"
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
            className={[
              'peer block w-full rounded-lg border border-input-border bg-transparent px-3 pt-4 pb-2 shadow-inner',
              'text-sm text-text-primary transition-all duration-200',
              'focus:outline-1 focus:outline-offset-1',
              'hover:border-input-border-hover',
              trailingContent ? 'pr-10' : '',
              error
                ? 'border-error focus:outline-error focus:border-error'
                : 'focus:outline-primary focus:border-primary',
              disabled ? 'cursor-not-allowed opacity-50' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={[
                'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 origin-left text-sm transition-all duration-200',
                'bg-paper px-0.5',
                'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
                'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75',
                'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75',
                error ? 'text-error peer-focus:text-error' : 'text-text-secondary peer-focus:text-primary',
              ].join(' ')}
            >
              {label}
              {required && (
                <>
                  <span aria-hidden="true" className="ml-0.5">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
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
          <div className="overflow-hidden">
            {error ? (
              <span id={errorId} role="alert" className="block pt-1 px-1 text-xs text-error">
                <Icon type="alert" className="inline-block mr-1 mb-0.5" />
                {error}
              </span>
            ) : (
              <span id={helperId} className="block pt-1 px-1 text-xs text-secondary">
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
