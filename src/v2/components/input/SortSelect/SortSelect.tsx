import Icon from '@/components/new/Icon/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

export interface SortOption {
  value: string;
  label: string;
}

const FIELD = 'flex items-center gap-2 rounded-xl border border-current/15 bg-paper px-3 py-2 text-sm';

interface Props {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  reversed: boolean;
  onReverse: () => void;
  className?: string;
  'data-testid'?: string;
}

/** Ordering controls for a client-sorted list: the field, and the direction. */
const SortSelect = ({
  options,
  value,
  onChange,
  reversed,
  onReverse,
  className = '',
  'data-testid': testId,
}: Props) => {
  const { t } = useTranslation();
  const id = useId();
  const direction = t(`v2.ui.sort.${reversed ? 'desc' : 'asc'}`);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className={`${FIELD} focus-within:ring-2 focus-within:ring-current/40`} htmlFor={id}>
        <Icon type="sortAsc" size="1.1em" className="shrink-0 opacity-70" />
        <span className="opacity-70">{t('v2.ui.sort.label')}</span>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="cursor-pointer bg-paper outline-none"
          data-testid={testId}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className={`${FIELD} cursor-pointer hover:bg-current/5`}
        aria-pressed={reversed}
        aria-label={direction}
        title={direction}
        onClick={onReverse}
        data-testid={testId ? `${testId}-direction` : undefined}
      >
        <Icon type={reversed ? 'sortDesc' : 'sortAsc'} size="1.1em" />
      </button>
    </div>
  );
};

export default SortSelect;
