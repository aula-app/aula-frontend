import SelectInput, { SelectOption } from '@/v2/components/input/SelectInput';
import { useMemo } from 'react';
import { compareNames } from './ReviewTable/candidates';

interface Props {
  label: string;
  /** Label of the no-filter option. */
  allLabel: string;
  /** Sorted here. */
  entries: SelectOption[];
  /** Null for no filter. */
  value: number | null;
  onChange: (value: number | null) => void;
  'data-testid'?: string;
}

const CandidateFilter = ({ label, allLabel, entries, value, onChange, 'data-testid': testId }: Props) => {
  const options = useMemo(
    () => [{ value: '', label: allLabel }, ...[...entries].sort((a, b) => compareNames(a.label, b.label))],
    [allLabel, entries]
  );

  return (
    <SelectInput
      dense
      label={label}
      options={options}
      value={value === null ? '' : String(value)}
      onChange={(next) => onChange(next === '' ? null : Number(next))}
      data-testid={testId}
    />
  );
};

export default CandidateFilter;
