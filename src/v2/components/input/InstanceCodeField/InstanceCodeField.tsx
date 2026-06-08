import TextInput from '@/v2/components/input/TextInput';
import { useTranslation } from 'react-i18next';
import IconButton from '../../button/IconButton';
import Icon from '../../ui/Icon';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isEditing: boolean;
  onEditClick: () => void;
  onConfirmClick?: () => void;
  disabled?: boolean;
};

const InstanceCodeField = ({ value, onChange, error, isEditing, onEditClick, onConfirmClick, disabled }: Props) => {
  const { t } = useTranslation();

  return (
    <TextInput
      label={t('v2.form.code.label')}
      required
      autoCapitalize="none"
      error={error}
      helperText={isEditing ? t('v2.page.code.hint') : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={!isEditing || disabled}
      data-testid="instance-code"
      endAdornment={
        isEditing ? (
          <IconButton type="button" onClick={onConfirmClick} aria-label={t('v2.ui.button.confirm')} disabled={disabled}>
            <Icon type="confirm" />
          </IconButton>
        ) : (
          <IconButton type="button" onClick={onEditClick} aria-label={t('v2.ui.button.edit')} disabled={disabled}>
            <Icon type="edit" />
          </IconButton>
        )
      }
    />
  );
};

export default InstanceCodeField;
