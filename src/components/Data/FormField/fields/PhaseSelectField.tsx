import { RoomPhases } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { InputSettings } from '@/utils/Data';
import { Control } from 'react-hook-form-mui';
import SelectField from './SelectField';

type Props = {
  phase: RoomPhases;
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
};

/**
 * Renders "PhaseSelectField" component
 */

const PhaseSelectField = ({ data, phase, control, disabled = false, ...restOfProps }: Props) => {
  data.form.options = [
    { label: 'phases.discussion', value: 10 },
    { label: 'phases.approval', value: 20 },
  ].concat(
    checkPermissions(50)
      ? [
          { label: 'phases.voting', value: 30 },
          { label: 'phases.results', value: 40 },
        ]
      : []
  );

  return <SelectField data={data} control={control} disabled={!checkPermissions(50) && phase >= 30} />;
};

export default PhaseSelectField;
