import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import { useTranslation } from 'react-i18next';
import SelectInput, { SelectInputProps } from '@/v2/components/input/SelectInput';

interface PhaseFieldProps extends Omit<SelectInputProps, 'options' | 'label' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const PhaseField: React.FC<PhaseFieldProps> = ({ value, onChange, disabled = false, ...props }) => {
  const { t } = useTranslation();

  const options = (Object.keys(phases) as `${RoomPhases}`[])
    .filter((phase) => phase !== '0')
    .map((phase) => ({
      value: phase,
      label: t(`phases.${phases[phase]}`),
    }));

  return (
    <SelectInput
      label={t('settings.columns.phase_id')}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
      className="w-full"
      {...props}
    />
  );
};

export default PhaseField;
