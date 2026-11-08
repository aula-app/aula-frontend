import { Label } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface FieldLabelProps {
  children: string;
  required?: boolean;
  invalid?: boolean;
  dense?: boolean;
  /** Offsets the resting label past a start adornment. */
  hasStart?: boolean;
  /** Forces the floated/resting position. Omit to follow the sibling input's focus and placeholder state. */
  floated?: boolean;
  className?: string;
}

const FieldLabel = ({ children, required, invalid, dense, hasStart, floated, className }: FieldLabelProps) => {
  const { t } = useTranslation();
  const followsPeer = floated === undefined;

  return (
    <Label
      className={twMerge(
        'pointer-events-none absolute left-3 origin-left text-sm transition-all duration-200 bg-background px-0.5',
        'text-nowrap text-ellipsis max-w-full overflow-hidden',
        followsPeer
          ? twMerge(
              'top-1/2 -translate-y-1/2',
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75',
              'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75',
              hasStart && twMerge(dense ? 'left-8' : 'left-10', 'peer-focus:left-3 peer-not-placeholder-shown:left-3'),
              invalid ? 'text-error-fg peer-focus:text-error-fg' : 'text-muted peer-focus:text-current'
            )
          : twMerge(
              floated ? 'top-0 -translate-y-1/2 scale-75' : 'top-1/2 -translate-y-1/2 scale-100',
              invalid ? 'text-error-fg' : 'text-current'
            ),
        className
      )}
    >
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="ml-0.5">
            *
          </span>
          <span className="sr-only">{t('v2.form.validation.required')}</span>
        </>
      )}
    </Label>
  );
};

export default FieldLabel;
