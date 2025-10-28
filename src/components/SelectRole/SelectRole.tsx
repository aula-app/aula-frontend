import SelectField from '@/components/DataFields/SelectField';
import { RoleTypes } from '@/types/SettingsTypes';
import { roles } from '@/utils';
import { BaseTextFieldProps } from '@mui/material';
import { Control, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props extends BaseTextFieldProps {
  control?: Control<any, any>,
  defaultValue?: RoleTypes | 0;
  noAdmin?: boolean;
  noRoom?: boolean;
  allowAll?: boolean;
  onChange?: (newRole: RoleTypes | 0) => void;
}

const SelectRole: React.FC<Props> = ({
  control,
  defaultValue,
  noAdmin = false,
  noRoom = false,
  allowAll = false,
  onChange,
  ...restOfProps
}) => {
  const { t } = useTranslation();

  const RoleOptionTypes = [
    noRoom ? { value: 0, label: t(`roles.empty`) } : null,
    allowAll ? { value: 0, label: t(`ui.common.all`) } : null,
    ...roles.filter((role) => (noAdmin ? role < 40 : role < 60)).map((r) => ({ value: r, label: t(`roles.${r}`) }))
  ].filter((r) => r !== null);

  return (
    <SelectField
      control={control ?? useForm({ defaultValues: { roles: defaultValue ?? RoleOptionTypes[0].value } }).control}
      options={RoleOptionTypes}
      name='roles'
      label={t('settings.columns.userlevel')}
      onChange={(event) => onChange !== undefined
        ? onChange(Number(event.target.value) as RoleTypes | 0)
        : undefined} // Ensure value is cast to number
      sx={{ minWidth: 200 }}
      {...restOfProps}
    />
  );
};

export default SelectRole;
