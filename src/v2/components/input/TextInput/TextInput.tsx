import IconButton from '@/v2/components/button/IconButton';
import { FieldHint, FieldLabel, fieldBoxClasses } from '@/v2/components/input/Field';
import Icon from '@/v2/components/ui/Icon';
import { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import { Input, TextField, TextFieldProps } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export interface TextInputProps extends Omit<
  TextFieldProps,
  'children' | 'className' | 'style' | 'isDisabled' | 'isRequired' | 'isInvalid' | 'validationBehavior'
> {
  label: string;
  error?: string;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  dense?: boolean;
  /** Decorative content at the start of the input, e.g. an icon. Not interactive. */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  /** Applied to the input element. */
  className?: string;
  autoCapitalize?: InputHTMLAttributes<HTMLInputElement>['autoCapitalize'];
  'data-testid'?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      dense = false,
      className,
      type,
      startAdornment,
      endAdornment,
      autoCapitalize,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();

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
      <TextField
        {...props}
        type={resolvedType}
        isDisabled={disabled}
        isRequired={required}
        isInvalid={!!error}
        validationBehavior="aria"
        className="flex flex-col w-full"
      >
        <div className="relative">
          <Input
            ref={ref}
            placeholder=" "
            autoCapitalize={autoCapitalize}
            data-testid={dataTestId}
            className={twMerge(
              fieldBoxClasses({ dense, invalid: !!error, hasStart: !!startAdornment, hasEnd: !!trailingContent }),
              className
            )}
          />
          {startAdornment && (
            <div
              className={twMerge(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted',
                dense ? 'left-3' : 'left-4'
              )}
            >
              {startAdornment}
            </div>
          )}
          <FieldLabel required={required} invalid={!!error} dense={dense} hasStart={!!startAdornment}>
            {label}
          </FieldLabel>
          {trailingContent && <div className="absolute right-1 top-1/2 -translate-y-1/2">{trailingContent}</div>}
        </div>
        <FieldHint error={error} helperText={helperText} />
      </TextField>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
